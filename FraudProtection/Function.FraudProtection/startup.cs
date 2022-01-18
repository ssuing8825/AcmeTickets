using AcmeTickets.FraudProtection.Domain;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NServiceBus;
using System;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(Startup))]
[assembly: NServiceBusTriggerFunction(Startup.EndpointName)]


public class Startup : FunctionsStartup
{
    public const string EndpointName = "ASBTriggerFraudProtection";

    public override void Configure(IFunctionsHostBuilder builder)
    {
        var services = builder.Services;

        services.AddApplicationInsightsTelemetry();

        //// register custom service in the container
        //services.AddSingleton(_ =>
        //{
        //    var configurationRoot = builder.GetContext().Configuration;
        //    var customComponentInitializationValue = configurationRoot.GetValue<string>("CustomComponentValue");

        //    return new CustomComponent(customComponentInitializationValue);
        //});

        builder.UseNServiceBus(() =>
        {
            var configuration = new ServiceBusTriggeredEndpointConfiguration(EndpointName);

            configuration.UseSerialization<NewtonsoftSerializer>();
           // configuration.DefineCriticalErrorAction(OnCriticalError);
            configuration.AdvancedConfiguration.Conventions()
                .DefiningCommandsAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Commands"))
                .DefiningEventsAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Events"))
                .DefiningMessagesAs(x => null != x.Namespace && x.Namespace.Contains("Contracts.Messages"));

            configuration.Transport.SubscriptionNamingConvention(x => x?.Replace("AcmeTickets.", string.Empty).Replace("Contracts.", string.Empty).Replace("Internal.", string.Empty));
            configuration.Transport.SubscriptionRuleNamingConvention(x => x.Name?.Replace("AcmeTickets.", string.Empty).Replace("Contracts.", string.Empty).Replace("Internal.", string.Empty));
            configuration.Transport.TopicName("AcmeTickets");
            var routing = configuration.Transport.Routing();
            BusRoutes.GetRoutes(routing);

            return configuration;
        });

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
        //  builder.UseNServiceBus(() => new ServiceBusTriggeredEndpointConfiguration(EndpointName));
    }
}

