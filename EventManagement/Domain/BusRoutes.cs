using AcmeTickets.EventManagement.Contracts.Commands;
using NServiceBus;

namespace AcmeTickets.EventManagement.Domain
{
    public static class BusRoutes
    {
        public static void GetRoutes(RoutingSettings<AzureServiceBusTransport> routing)
        {
            routing.RouteToEndpoint(typeof(PurchaseAllocatedTickets), "AcmeTickets.EventManagement.Endpoint");
        }
    }
}
