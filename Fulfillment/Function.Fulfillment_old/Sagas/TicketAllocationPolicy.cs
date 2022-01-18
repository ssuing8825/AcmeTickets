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
    public class TicketAllocationPolicy : Saga<TicketAllocationPolicyData>
        , IAmStartedByMessages<IEventTicketGroupCreated>
        , IHandleMessages<IPurchaseOrderPlaced>
    {
        static readonly ILog Log = LogManager.GetLogger(typeof(TicketAllocationPolicy));

        public TicketAllocationPolicy()
        {

        }
        public async Task Handle(IEventTicketGroupCreated message, IMessageHandlerContext context)
        {
            Log.Info($" Handling IEventTicketGroupCreated");
            //// When the group is created we just mapp the data and we're done
            this.Data.TicketGroupId = message.TicketGroupId;
            this.Data.Tickets = message.Tickets;
            this.Data.AllocatedTickets = new List<Guid>();
            await Task.CompletedTask;
        }

        public async Task Handle(IPurchaseOrderPlaced message, IMessageHandlerContext context)
        {
            Log.Info($" Handling IPurchaseOrderPlaced In the Saga message. NumMsg:{message.NumberOfTickets} TicketGroupId:{message.TicketGroupId} {message.MarketplaceId} {message.OrderId}");

            //// Determine if we can fill out this order
            //// If we can fill out this order, allocate the tickets


            ////Assume that all tickets are contiguous. 
            if (this.Data.AllocatedTickets.Count < message.NumberOfTickets)
            {
                //// TODO in this case we cannot allocate the tickets since they've been allocated. 
            }

            //// Get the first X number of tickets
            var listOfTicketsForOrder = this.Data.Tickets.Take(message.NumberOfTickets);

            //// Allocate these tickets so they don't get selected again.
            this.Data.AllocatedTickets.AddRange(listOfTicketsForOrder.Select(c => c.TicketId));

            await context.Publish<ITicketsAllocatedToPurchase>(x =>
            {
                x.TicketGroupId = message.TicketGroupId;
                x.MarketPlaceId = message.MarketplaceId;
                x.Tickets = listOfTicketsForOrder.Select(c => c.TicketId).ToList();
            });

            await CloseOutTicketGroupIfComplete(context);
        }
        private async Task CloseOutTicketGroupIfComplete(IMessageHandlerContext context)
        {
            //// There may be many ways for a saga to be complete. 
            ////    1. All teh tickets might be allocated
            ////    2. The event might have passed 
            ////    3. Someone took the ticket group off the market

            if (this.Data.AllocatedTickets.Count <= this.Data.Tickets.Count())
                return;


            ////TODO Is there an event we need to send when the ordergroup is complete?
            ////await context.Send<WriteToGeneralLedger>(x =>
            ////{

            ////});

            this.MarkAsComplete();

            await Task.CompletedTask;
        }
        protected override void ConfigureHowToFindSaga(SagaPropertyMapper<TicketAllocationPolicyData> mapper)
        {
            mapper.ConfigureMapping<IEventTicketGroupCreated>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
            mapper.ConfigureMapping<IPurchaseOrderPlaced>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
        }
    }
}
