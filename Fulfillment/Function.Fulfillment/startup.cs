using Acme.Nsb.Commons;
using AcmeTickets.Fulfillment.Domain;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using NServiceBus;

[assembly: FunctionsStartup(typeof(Startup))]
[assembly: NServiceBusTriggerFunction(Startup.EndpointName)]


public class Startup : FunctionsStartup
{
    public const string EndpointName = "ASBTriggerFulfillment";

    public override void Configure(IFunctionsHostBuilder builder)
    {
        FunctionsHostBuilderContext context = builder.GetContext();
        var services = builder.Services;

        services.AddApplicationInsightsTelemetry();

        builder.UseNServiceBus(() =>
        {
            var configuration = NServiceBusConfigurationExtensions.DefaultAcmeTicketsConfiguration(EndpointName, BusRoutes.GetRoutes, context);
            return configuration;
        });
    }
}

