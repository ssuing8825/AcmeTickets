using AcmeTickets.Fulfillment.Contracts.Events;
using AcmeTickets.Inventory.Contracts.Events;
using NServiceBus;
using NServiceBus.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Function.Fulfillment.Handlers
{
    public class TicketPurchasedHandler : IHandleMessages<ITicketsAllocatedToOrder>
    {
        static ILog Log = LogManager.GetLogger(typeof(TicketPurchasedHandler));

        public async Task Handle(ITicketsAllocatedToOrder message, IMessageHandlerContext context)
        {
            Log.Info($"TicketPurchasedHandler: for TicketGroupId {message.TicketGroupId}");
            await context.Publish<IOrderFulfilled>(x =>
            {
                x.EventId = message.EventId;
                x.TicketGroupId = message.TicketGroupId;
                x.AllocatedTickets = message.AllocatedTickets;
                x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                x.EventellectOrderId = message.EventellectOrderId;
            });
        }
    }
}
