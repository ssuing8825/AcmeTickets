using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Events;
using System;
using AcmeTickets.EventManagement.Contracts.Messages;
using AcmeTickets.ITOps.Contracts.Messages;
using AcmeTickets.Inventory.Contracts.Commands;

namespace AcmeTickets.EventManagement.Function.Purchase.Handlers
{
    public class PurchaseTicketsHandler : IHandleMessages<PurchaseAllocatedTickets>, IHandleMessages<OrderDataRetrieved>
    {
        static ILog Log = LogManager.GetLogger(typeof(PurchaseTicketsHandler));

        public PurchaseTicketsHandler()
        {

        }

        public async Task Handle(PurchaseAllocatedTickets message, IMessageHandlerContext context)
        {
            ////TODO we do not always need to go to the marketplace. Only do this if we don't have enough information and the message is invalid
            if (message.NeedsAugmented())
            {
                Log.Info($"Handling purchase ticket command : Publishing INeedOrderDataFromMarket TicketGroupId {message.TicketGroupId}");
                await context.Publish<INeedAdditionalDataToCompletePurchase>(x =>
                {
                    x.MarketplaceId = message.MarketplaceId;
                    x.TicketGroupId = message.TicketGroupId;
                    //TODO: 'OrderId' is it marketplace or eventellect orderId?
                    x.OrderId = message.MarketplaceOrderKey;
                });
                //// We don't have enough informaion to continue so get out
                return;
            }

            ////TODO: If the message isn't valid then return an exception message
            if (message.NumberOfTickets == 0)
            {
                await ReplyWithFailure(context);
                return;
            }

            Log.Info($"Purchase Ticket Command was valid : Publishing IPurchaseOrderPlaced TicketGroupId {message.TicketGroupId}");

            await PublishPurchaseOrderPlaced(context, message.MarketplaceOrderKey, message.NumberOfTickets, message.TicketGroupId);

            await ReplyWithSuccess(context);

        }
        public async Task Handle(OrderDataRetrieved message, IMessageHandlerContext context)
        {
            await PublishPurchaseOrderPlaced(context, message.OrderId, message.NumberOfTicketsRequested, message.TicketGroupId);
        }

        private async Task ReplyWithFailure(IMessageHandlerContext context)
        {
            var objectResponseMessage = new PurchaseTicketsResponse
            {
                Response = "The purchase request was not valid"
            };
            await context.Reply(objectResponseMessage);
        }

        private async Task ReplyWithSuccess(IMessageHandlerContext context)
        {
            var objectResponseMessage = new PurchaseTicketsResponse
            {
                Response = "The purchase request valid and is being processed"
            };
            await context.Reply(objectResponseMessage);
        }

        private async Task PublishPurchaseOrderPlaced(IMessageHandlerContext context, Guid orderId, int numberOfTicketsRequested, Guid ticketGroupId)
        {
            await context.Publish<IPurchaseOrderPlaced>(x =>
            {
                x.TicketGroupId = ticketGroupId;
                x.NumberOfTickets = numberOfTicketsRequested;
                x.OrderId = orderId;
            });
        }
    }
}
