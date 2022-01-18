using Acme.Pricing.Contracts.Events;
using Acme.StateMandatedCharges.Contracts.Events;
using NServiceBus.Logging;
using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Endpoint.Handlers
{
    public class StateMandatedChargesCalculatedHandler : 
        IHandleMessages<IStateMandatedChargesCalculated>
    {
        static readonly ILog Log = LogManager.GetLogger<StateMandatedChargesCalculatedHandler>();
        public StateMandatedChargesCalculatedHandler()
        {

        }

        public async Task Handle(IStateMandatedChargesCalculated message, IMessageHandlerContext context)
        {
            Log.Debug($"Handling smc calculated event.");
           
            await Task.CompletedTask;
        }
    }
}
