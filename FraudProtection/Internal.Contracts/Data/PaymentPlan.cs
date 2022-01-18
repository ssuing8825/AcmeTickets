using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Interrnal.Contracts.Data
{
    public class PaymentPlan
    {
        public Guid ApplicationId { get; set; }

        public string Description { get; set; }

        public Guid PaymentPlanId { get; set; }
    }
}
