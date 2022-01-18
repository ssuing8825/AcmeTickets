using AcmeTickets.EventMangement.Internal.Contracts.Commands;
using NServiceBus;

namespace AcmeTickets.Inventory.Domain
{
    public static class BusRoutes
    {
        public static void GetRoutes(RoutingSettings<AzureServiceBusTransport> routing)
        {
            routing.RouteToEndpoint(typeof(WriteToGeneralLedger), "AcmeTickets.Inventory.Endpoint");
        }
    }
}
