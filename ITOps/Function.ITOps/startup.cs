using Acme.Nsb.Commons;
using AcmeTickets.ITOps.Domain;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NServiceBus;
using System;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Domain.Managers;
using AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB;
using AcmeTickets.EventManagement.Integration;
using AcmeTickets.ITOps.Integration.Commands;

[assembly: FunctionsStartup(typeof(Startup))]
[assembly: NServiceBusTriggerFunction(Startup.EndpointName)]


public class Startup : FunctionsStartup
{
    public const string EndpointName = "ASBTriggerITOps";

    public override void Configure(IFunctionsHostBuilder builder)
    {
        FunctionsHostBuilderContext context = builder.GetContext();
        var services = builder.Services;

        services.AddApplicationInsightsTelemetry();

        //// register custom service in the container
        //services.AddSingleton(_ =>
        //{
        //    var configurationRoot = builder.GetContext().Configuration;
        //    var customComponentInitializationValue = configurationRoot.GetValue<string>("CustomComponentValue");

        //    return new CustomComponent(customComponentInitializationValue);
        //});
        services.AddTransient<IProvideEventInfo, EventInfoProvider>();

        builder.UseNServiceBus(() =>
        {
            var configuration = NServiceBusConfigurationExtensions.DefaultAcmeTicketsConfiguration(EndpointName, BusRoutes.GetRoutes, context);
            return configuration;
        });
    }
}

