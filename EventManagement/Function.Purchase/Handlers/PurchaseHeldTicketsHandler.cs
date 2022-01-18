using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Events;
using System;
using System.Collections.Generic;
using AcmeTickets.EventManagement.Contracts.Messages;
using AcmeTickets.ITOps.Contracts.Messages;
using Microsoft.Azure.Amqp.Serialization;
using Microsoft.Azure.Cosmos.Linq;

namespace AcmeTickets.EventManagement.Function.Purchase.Handlers
{
    public class PurchaseHeldTicketsHandler :
        IHandleMessages<PurchaseHeldTickets>,
        IHandleMessages<OrderDataRetrieved>
    {
        static ILog Log = LogManager.GetLogger(typeof(PurchaseHeldTicketsHandler));

        public PurchaseHeldTicketsHandler()
        {

        }

        public async Task Handle(PurchaseHeldTickets message, IMessageHandlerContext context)
        {
            ////TODO we do not always need to go to the marketplace. Only do this if we don't have enough information and the message is invalid
            if (message.NeedsAugmented())
            {
                Log.Info($"Handling purchase held ticket command : Publishing INeedOrderDataFromMarket TicketGroupId {message.TicketGroupId}");
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

            ////TODO: If the message isn've valid then return an exception message
            // if (string.IsNullOrWhiteSpace(message.MarketplaceOrderKey.ToString()))
            // {
            //     await ReplyWithFailure(context);
            //     return;
            // }

            Log.Info($"Purchase Held Tickets Command was valid : Publishing IPurchaseOrderPlaced TicketGroupId {message.TicketGroupId}");

            await PublishHeldTicketsPurchased(context, message.MarketplaceOrderKey, message.AllocatedTickets, message.TicketGroupId);

            // await ReplyWithSuccess(context);

        }
        public async Task Handle(OrderDataRetrieved message, IMessageHandlerContext context)
        {
            await PublishHeldTicketsPurchased(context, message.OrderId, message.AllocatedTickets, message.TicketGroupId);
        }

        // private async Task ReplyWithFailure(IMessageHandlerContext context)
        // {
        //     // TODO: Create a specific response message
        //     var objectResponseMessage = new PurchaseTicketsResponse
        //     {
        //         Response = "The purchase request was not valid"
        //     };
        //     await context.Reply(objectResponseMessage);
        // }

        // private async Task ReplyWithSuccess(IMessageHandlerContext context)
        // {
        //     // TODO: Create a specific response message
        //     var objectResponseMessage = new PurchaseTicketsResponse
        //     {
        //         Response = "The purchase request valid and is being processed"
        //     };
        //     await context.Reply(objectResponseMessage);
        // }

        private async Task PublishHeldTicketsPurchased(IMessageHandlerContext context, Guid orderId, List<Guid> allocatedTickets, Guid ticketGroupId)
        {
            await context.Publish<IHeldTicketsPurchased>(x =>
            {
                x.TicketGroupId = ticketGroupId;
                x.AllocatedTickets = allocatedTickets;
                x.MarketplaceOrderKey = orderId;
                //x.EventellectOrderId = orderId;
            });
        }
    }
}
