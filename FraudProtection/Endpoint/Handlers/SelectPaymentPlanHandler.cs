using AcmeTickets.FraudProtection.Contracts.Commands;
using AcmeTickets.FraudProtection.Internal.Contracts.Events;
using NServiceBus;
using NServiceBus.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Endpoint.Handlers
{
    public class SelectPaymentPlanHandler : IHandleMessages<SelectPaymentPlan>
    {
        static readonly ILog Log = LogManager.GetLogger(typeof(SelectPaymentPlanHandler));

        public SelectPaymentPlanHandler()
        {

        }

        public async Task Handle(SelectPaymentPlan message, IMessageHandlerContext context)
        {
            Log.Info($"Handling payment plan selection command");
            await context.Publish<ISelectedAPaymentPlan>(x =>
            {
                x.ApplicationId = message.ApplicationId;
            });
            await Task.CompletedTask;
        }
    }
}
