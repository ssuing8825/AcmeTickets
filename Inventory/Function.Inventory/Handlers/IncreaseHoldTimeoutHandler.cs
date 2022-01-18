using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Events;
using AcmeTickets.EventManagement.Contracts.Messages;
using NServiceBus;
using NServiceBus.Logging;

namespace AcmeTickets.EventManagement.Function.Inventory.Handlers
{
    public class IncreaseHoldTimeoutHandler :
        IHandleMessages<IncreaseHoldTimeout>
    {
        static ILog Log = LogManager.GetLogger(typeof(IncreaseHoldTimeoutHandler));

        public IncreaseHoldTimeoutHandler()
        {

        }

        public async Task Handle(IncreaseHoldTimeout message, IMessageHandlerContext context)
        {


            Log.Info(
                $"IncreaseHoldTimeout Command was valid : Publishing INeedToIncreaseHoldTimeout TicketGroupId {message.TicketGroupId}");

            await PublishIncreaseHoldTimeout(context, message.MarketplaceOrderKey, message.AllocatedTickets,
                message.TicketGroupId);


        }
        private async Task PublishIncreaseHoldTimeout(IMessageHandlerContext context, Guid orderId,
            List<Guid> allocatedTickets, Guid ticketGroupId)
        {
            await context.Publish<INeedToIncreaseHoldTimeout>(x =>
            {
                x.TicketGroupId = ticketGroupId;
                x.AllocatedTickets = allocatedTickets;
                x.MarketplaceOrderKey = orderId;
            });
        }
    }
}
