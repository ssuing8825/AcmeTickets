using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Events;
using AcmeTickets.ITOps.Contracts;
using AcmeTickets.ITOps.Contracts.Messages;

namespace AcmeTickets.Inventory.Function.Purchase.Handlers
{
    public class AugmentOrderTicketMasterHandler : IHandleMessages<INeedAdditionalDataToCompletePurchase>
    {
        static ILog Log = LogManager.GetLogger(typeof(AugmentOrderTicketMasterHandler));

        public AugmentOrderTicketMasterHandler()
        {
        }

        public async Task Handle(INeedAdditionalDataToCompletePurchase message, IMessageHandlerContext context)
        {
            Log.Info($"INeedOrderDataFromMarket handled in {this.GetType()} {message.MarketplaceId}");

            /// Get out of the function if it's not my marketplace. This should probable be an enum
            if (message.MarketplaceId != 1) return;

            var orderdata = new OrderDataRetrieved()
            {
                TicketGroupId = message.TicketGroupId,
                OrderId = message.OrderId,
            };

            if ( message.NumberOfTickets == 0)
            {
                orderdata.NumberOfTicketsRequested = 2;
            }

            if (message.MarketplacePrice == 0)
            {
                orderdata.MarketplacePrice = 100m;
            }

            ///TODO We'd want to new up our domain and then go fetch the data and put it on the event.
            await context.Send(orderdata);

        }
    }
}
