using NServiceBus;
using NServiceBus.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Endpoint.Handlers
{
    public class CalculatedPricingHandler : IHandleMessages<ICalculatedPricing>
    {
        static readonly ILog Log = LogManager.GetLogger<CalculatedPricingHandler>();
        public CalculatedPricingHandler()
        {

        }

        public async Task Handle(ICalculatedPricing message, IMessageHandlerContext context)
        {
            Log.Debug($"Handling pricing calculated event.");
            await Task.CompletedTask;
        }
    }
}
