using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Domain
{
    public static class BusRoutes
    {
        public static void GetRoutes(RoutingSettings<AzureServiceBusTransport> routing)
        {
     //       routing.RouteToEndpoint(typeof(SelectPaymentPlan), "AcmeTickets.FraudProtection.Endpoint");
     //       routing.RouteToEndpoint(typeof(ProcessPayment), "Acme.PaymentAuthorization.Endpoint");
        }
    }
}
