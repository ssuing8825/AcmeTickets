using Acme.StateMandatedCharges.Contracts.Events;
using NServiceBus.Logging;
using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Acme.PolicyServicing.Contracts.Events;

namespace AcmeTickets.FraudProtection.Endpoint.Handlers
{
    public class PolicySoldHandler : IHandleMessages<IPolicySold>
    {
        static readonly ILog Log = LogManager.GetLogger<PolicySoldHandler>();
        public PolicySoldHandler()
        {

        }

        public async Task Handle(IPolicySold message, IMessageHandlerContext context)
        {
            Log.Debug($"Handling policy sold event.");

            await Task.CompletedTask;
        }
    }
}
