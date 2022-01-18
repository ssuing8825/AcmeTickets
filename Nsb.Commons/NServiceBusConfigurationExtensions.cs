using NServiceBus;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using System.Security.Cryptography.Xml;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;

namespace Acme.Nsb.Commons
{
    public static class NServiceBusConfigurationExtensions
    {

        public static EndpointConfiguration DefaultAcmeTicketsConfiguration(this HostBuilderContext ctx, string endpointName, Action<RoutingSettings<AzureServiceBusTransport>> routingSettingsConfiguration)
        {
            var config = ctx.Configuration;
            var dbConnectionString = config.GetSection("DbConnectionString").Value;
            var dbName = config.GetSection("DatabaseName").Value;
            var azServiceBusConnectString = config.GetSection("AzureWebJobsServiceBus").Value;

            var endpointConfiguration = new EndpointConfiguration(endpointName);
            endpointConfiguration.UseSerialization<NewtonsoftSerializer>();
            endpointConfiguration.DefineCriticalErrorAction(OnCriticalError);
            endpointConfiguration.Conventions()
                .DefiningCommandsAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Commands"))
                .DefiningEventsAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Events"))
                .DefiningMessagesAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Messages"));

            var transportExtensions = endpointConfiguration.UseTransport<AzureServiceBusTransport>();
            transportExtensions.SubscriptionNamingConvention(x => x?.Replace("AcmeTickets.", string.Empty).Replace("Contracts.", string.Empty).Replace("Internal.", string.Empty));
            transportExtensions.SubscriptionRuleNamingConvention(x => x.Name?.Replace("AcmeTickets.", string.Empty).Replace("Contracts.", string.Empty).Replace("Internal.", string.Empty));
            transportExtensions.TopicName("AcmeTickets");
            transportExtensions.ConnectionString($"{azServiceBusConnectString}");
            var routing = transportExtensions.Routing();
            routingSettingsConfiguration(routing);
            var persistence = endpointConfiguration.UsePersistence<CosmosPersistence>();
            persistence.DatabaseName($"{dbName}");
            persistence.CosmosClient(new CosmosClient(dbConnectionString));
            persistence.DefaultContainer("Server", "/id");

            endpointConfiguration.EnableInstallers();
            
            return endpointConfiguration;
        }



        /// <summary>
        /// This if for function endpoints and probable has some areas of improvement
        /// </summary>
        /// <param name="endpointName"></param>
        /// <param name="routingSettingsConfiguration"></param>
        /// <returns></returns>
        public static ServiceBusTriggeredEndpointConfiguration DefaultAcmeTicketsConfiguration(string endpointName, Action<RoutingSettings<AzureServiceBusTransport>> routingSettingsConfiguration, FunctionsHostBuilderContext context)
        {
            var config = context.Configuration;
            var dbConnectionString = config.GetSection("DbConnectionString").Value;
            var dbName = config.GetSection("DatabaseName").Value;
            
            var configuration = new ServiceBusTriggeredEndpointConfiguration(endpointName);
            configuration.UseSerialization<NewtonsoftSerializer>();
            configuration.AdvancedConfiguration.Conventions()
                        .DefiningCommandsAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Commands"))
                        .DefiningEventsAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Events"))
                        .DefiningMessagesAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Messages"));

            configuration.Transport.SubscriptionNamingConvention(x => x?.Replace("AcmeTickets.", string.Empty).Replace("Contracts.", string.Empty).Replace("Internal.", string.Empty));
            configuration.Transport.SubscriptionRuleNamingConvention(x => x.Name?.Replace("AcmeTickets.", string.Empty).Replace("Contracts.", string.Empty).Replace("Internal.", string.Empty));
            configuration.Transport.TopicName("AcmeTickets");

            var servicePlatformConnection = ServicePlatformConnectionConfiguration.Parse(@"{
                    ""Heartbeats"": {
                        ""Enabled"": true,
                        ""HeartbeatsQueue"": ""Particular.Eventellect"",
                        ""Frequency"": ""00:00:10"",
                        ""TimeToLive"": ""00:00:40""
                    },
                    ""MessageAudit"": {
                        ""Enabled"": true,
                        ""AuditQueue"": ""audit""
                    },
                    ""CustomChecks"": {
                        ""Enabled"": true,
                        ""CustomChecksQueue"": ""Particular.Eventellect""
                    },
                    ""ErrorQueue"": ""error"",
                    ""SagaAudit"": {
                        ""Enabled"": true,
                        ""SagaAuditQueue"": ""audit""
                    },
                    ""Metrics"": {
                        ""Enabled"": true,
                        ""MetricsQueue"": ""Particular.Monitoring"",
                        ""Interval"": ""00:00:01""
                    }
                }");

            configuration.AdvancedConfiguration.ConnectToServicePlatform(servicePlatformConnection);

            var persistence = configuration.AdvancedConfiguration.UsePersistence<CosmosPersistence>();
            var connection = $"{dbConnectionString}";
            persistence.DatabaseName($"{dbName}");
            persistence.CosmosClient(new CosmosClient(connection));
            persistence.DefaultContainer("Server", "/id");

            var routing = configuration.Transport.Routing();
            routingSettingsConfiguration(routing);

            return configuration;
        }

        static async Task OnCriticalError(ICriticalErrorContext context)
        {
            try
            {
                await context.Stop();
            }
            finally
            {
                FailFast($"Critical error, shutting down: {context.Error}", context.Exception);
            }
        }

        static void FailFast(string message, Exception exception)
        {
            try
            {
            }
            finally
            {
                Environment.FailFast(message, exception);
            }
        }
    }
}
