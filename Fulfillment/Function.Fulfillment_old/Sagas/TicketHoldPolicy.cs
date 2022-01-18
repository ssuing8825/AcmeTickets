using AcmeTickets.EventManagement.Contracts.Events;
using AcmeTickets.Fulfillment.Contracts;
using AcmeTickets.Fulfillment.Contracts.Events;
using Function.Fulfillment.Sagas.Data;
using NServiceBus;
using NServiceBus.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Function.Fulfillment.Sagas
{
    internal class TicketHoldPolicy : Saga<TicketHoldPolicyData>,
        IAmStartedByMessages<INeedToHoldTickets>
    {
        static readonly ILog Log = LogManager.GetLogger(typeof(TicketHoldPolicy));

        public async Task Handle(INeedToHoldTickets message, IMessageHandlerContext context)
        {
            Log.Info($" Handling INeedToHoldTickets");

            this.Data.TicketGroupId = message.TicketGroupId;
            this.Data.AllocatedTickets = message.AllocatedTickets;

            // TODO what are we locking on here ? orderId
            // TODO how many times can a tickets be kept on hold ? hardcode it to 2, maxholdattempts
            // (dont do this now) TODO save to db with the orderId ? yes, we get if from the allocation policy


            await context.Publish<TicketsHeld>(x =>
            {
                x.TicketGroupId = message.TicketGroupId;
                x.AllocatedTickets = message.AllocatedTickets;
            });

            // TODO how long should the tickets be kept on hold ? maxholdtime.. 
            await RequestTimeout<TicketHoldExpired>(context, TimeSpan.FromSeconds(30));
        }

        protected override void ConfigureHowToFindSaga(SagaPropertyMapper<TicketHoldPolicyData> mapper)
        {
            mapper.ConfigureMapping<INeedToHoldTickets>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
            // mapper.ConfigureMapping<IPurchaseOrderPlaced>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
        }
    }

    public class TicketHoldExpired
    {
    }
}
