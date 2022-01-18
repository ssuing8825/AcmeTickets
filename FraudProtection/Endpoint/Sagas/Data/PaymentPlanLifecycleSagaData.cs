using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Endpoint.Sagas.Data
{
    public class PaymentPlanLifecycleSagaData : IContainSagaData
    {
        public Guid Id { get; set; }
        public string Originator { get; set; }
        public string OriginalMessageId { get; set; }

        public Guid PolicyId { get; set; }
    }
}
