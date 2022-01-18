using AcmeTickets.Inventory.Contracts.Events;
using AcmeTickets.Inventory.Internal.Contracts.Events;
using AcmeTickets.EventManagement.Contracts.Events;
using Function.Inventory.Sagas.Data;
using NServiceBus;
using NServiceBus.Logging;
using System;
using System.Threading.Tasks;

namespace Function.Inventory.Sagas
{
    public class TicketHoldPolicy : Saga<TicketHoldPolicyData>,
        IAmStartedByMessages<INeedToHoldTickets>,
        IHandleMessages<IHeldTicketsPurchased>,
        IHandleMessages<INeedToIncreaseHoldTimeout>,
        IHandleMessages<IOrderCancelled>, //AcmeTickets.Inventory.Contracts.Events.IOrderCancelled
        IHandleTimeouts<TicketHoldExpired>
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(TicketHoldPolicy));
        private const int MaxHoldAttempts = 2;
        private const int MaxHoldTime = 3;


        public async Task Handle(INeedToHoldTickets message, IMessageHandlerContext context)
        {

            Log.Info($"Handling INeedToHoldTickets for TicketGroupId: {message.TicketGroupId}, MarketplaceOrderKey {message.MarketplaceOrderKey} EventellectOrderId { message.EventellectOrderId}");

            this.Data.TicketGroupId = message.TicketGroupId;
            this.Data.AllocatedTickets = message.AllocatedTickets;
            this.Data.MarketplaceOrderKey = message.MarketplaceOrderKey;
            this.Data.EventellectOrderId = message.EventellectOrderId;
            this.Data.EventId = message.EventId;


            // TODO what are we locking on here ? Based on discussion it is "orderId"
            // TODO how many times can a tickets be kept on hold ? for now hard code it to 2, maxholdattempts
            // TODO save to db with the orderId ? based on discussion, we dont go the DB.


            await context.Publish<ITicketsHeld>(x =>
            {
                x.TicketGroupId = message.TicketGroupId;
                x.AllocatedTickets = message.AllocatedTickets;
                x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                x.EventellectOrderId = message.EventellectOrderId;
            });

            Log.Info($"Published ITicketsHeld event for TicketGroupId: {message.TicketGroupId}, MarketplaceOrderKey {message.MarketplaceOrderKey} EventellectOrderId { message.EventellectOrderId}"); ;

            await RequestTimeout<TicketHoldExpired>(context, TimeSpan.FromMinutes(MaxHoldTime));
            Log.Info($"Requested Timeout for  TicketGroupId: {message.TicketGroupId}, MarketplaceOrderKey {message.MarketplaceOrderKey} EventellectOrderId { message.EventellectOrderId}"); ;

        }

        public async Task Handle(IHeldTicketsPurchased message, IMessageHandlerContext context)
        {
            Log.Info($"Handling IHeldTicketsPurchased");

            await context.Publish<ITicketsAllocatedToOrder>(x =>
            {
                x.TicketGroupId = message.TicketGroupId;
                x.AllocatedTickets = message.AllocatedTickets;
                x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                x.EventellectOrderId = message.EventellectOrderId;
                x.EventId = this.Data.EventId;
            });

            Log.Info($"Published IHeldTicketsPurchased event and marked the saga as completed for  TicketGroupId: {message.TicketGroupId}, MarketplaceOrderKey {message.MarketplaceOrderKey} EventellectOrderId { message.EventellectOrderId}");
            await CloseOutTicketHoldIfComplete(context);
        }

        public async Task Timeout(TicketHoldExpired message, IMessageHandlerContext context)
        {

            if (Data.MarketPlaceRequestMoreTime && Data.NoOfHoldsRequestByMarketPlace <= MaxHoldAttempts)
            {
                //TODO: NSBExpert: we are requesting a new timeout from a timeout event, is this a correct pattern ?

                //TODO: check if we should consider elapsed time ?
                await RequestTimeout<TicketHoldExpired>(context, TimeSpan.FromMinutes(MaxHoldTime));

                // Resetting this back to handle the normal timeout.
                Data.MarketPlaceRequestMoreTime = false;
            }
            else
            {
                await context.Publish<IHoldExpired>(x =>
                {
                    x.TicketGroupId = Data.TicketGroupId;
                    x.AllocatedTickets = Data.AllocatedTickets;
                    x.MarketplaceOrderKey = Data.MarketplaceOrderKey;
                    x.EventellectOrderId = Data.EventellectOrderId;

                });
                await CloseOutTicketHoldIfComplete(context);
            }
        }

        public Task Handle(INeedToIncreaseHoldTimeout message, IMessageHandlerContext context)
        {
            Log.Info($"Received INeedToIncreaseHoldTimeout event  TicketGroupId: {message.TicketGroupId}, MarketplaceOrderKey {message.MarketplaceOrderKey}");

            Data.MarketPlaceRequestMoreTime = true;
            Data.NoOfHoldsRequestByMarketPlace += 1;
            return Task.CompletedTask;
        }

        public async Task Handle(IOrderCancelled message, IMessageHandlerContext context)
        {
            Log.Info($"Received IOrderCancelled event  TicketGroupId: {message.TicketGroupId}, MarketplaceOrderKey {message.MarketplaceOrderKey}");

            await context.Publish<IHoldExpired>(x =>
            {
                x.TicketGroupId = this.Data.TicketGroupId;
                x.AllocatedTickets = this.Data.AllocatedTickets;
                x.MarketplaceOrderKey = this.Data.MarketplaceOrderKey;
                x.EventellectOrderId = this.Data.EventellectOrderId;

            });
            await CloseOutTicketHoldIfComplete(context);
        }

        private async Task CloseOutTicketHoldIfComplete(IMessageHandlerContext context)
        {
            // TODO: validate scenarios before closing the saga
            this.MarkAsComplete();

            await Task.CompletedTask;
        }

        protected override void ConfigureHowToFindSaga(SagaPropertyMapper<TicketHoldPolicyData> mapper)
        {
            mapper.ConfigureMapping<INeedToHoldTickets>(x => x.MarketplaceOrderKey).ToSaga(s => s.MarketplaceOrderKey);
            mapper.ConfigureMapping<IHeldTicketsPurchased>(x => x.MarketplaceOrderKey).ToSaga(s => s.MarketplaceOrderKey);
            mapper.ConfigureMapping<INeedToIncreaseHoldTimeout>(x => x.MarketplaceOrderKey).ToSaga(s => s.MarketplaceOrderKey);
            mapper.ConfigureMapping<IOrderCancelled>(x => x.MarketplaceOrderKey).ToSaga(s => s.MarketplaceOrderKey);

        }
    }
}
