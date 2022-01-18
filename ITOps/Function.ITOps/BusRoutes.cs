using AcmeTickets.ITOps.Contracts.Messages;
using NServiceBus;

namespace AcmeTickets.ITOps.Domain
{
    public static class BusRoutes
    {
        public static void GetRoutes(RoutingSettings<AzureServiceBusTransport> routing)
        {

            routing.RouteToEndpoint(typeof(OrderDataRetrieved), "ASBTriggerEventManagementPurchase");
        }
    }
}
