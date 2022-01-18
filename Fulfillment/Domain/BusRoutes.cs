using AcmeTickets.EventMangement.Internal.Contracts.Commands;
using AcmeTickets.Inventory.Contracts.Events;
using NServiceBus;

namespace AcmeTickets.Fulfillment.Domain
{
    public static class BusRoutes
    {
        public static void GetRoutes(RoutingSettings<AzureServiceBusTransport> routing)
        {
            routing.RouteToEndpoint(typeof(ITicketsAllocatedToOrder), "ASBTriggerFulfillment");
        }
    }
}
