using AcmeTickets.Inventory.Contracts.Commands;
using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.ITOps.Domain
{
    public static class BusRoutes
    {
        public static void GetRoutes(RoutingSettings<AzureServiceBusTransport> routing)
        {
            //routing.RouteToEndpoint(typeof(PurchaseTicketsSync), "AcmeTickets.ITOps.Endpoint");
        }
    }
}
