using AcmeTickets.EventManagement.Contracts.Events;
using AcmeTickets.Inventory.Contracts;
using AcmeTickets.Inventory.Contracts.Commands;
using AcmeTickets.Inventory.Contracts.Events;
using AcmeTickets.Inventory.Contracts.Messages;
using AcmeTickets.Inventory.Internal.Contracts.Events;
using Function.Inventory.Sagas.Data;
using NServiceBus;
using NServiceBus.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Function.Inventory.Sagas
{
    public class TicketAllocationPolicy : Saga<TicketAllocationPolicyData>
        , IAmStartedByMessages<IEventTicketGroupCreated>
        , IHandleMessages<TicketAllocationRequest>
        , IHandleMessages<IHoldTicketsOrderPlaced>
        , IHandleMessages<HoldTickets>
        , IHandleMessages<IHoldExpired>

    {
        static readonly ILog Log = LogManager.GetLogger(typeof(TicketAllocationPolicy));

        public async Task Handle(IEventTicketGroupCreated message, IMessageHandlerContext context)
        {
            Log.Info($" Handling IEventTicketGroupCreated");
            //// When the group is created we just mapp the data and we're done
            this.Data.TicketGroupId = message.TicketGroupId;
            this.Data.Tickets = message.Tickets;
            this.Data.AllocatedTickets = new List<Guid>();
            this.Data.EventId = message.EventId;
            await Task.CompletedTask;
        }

        //public async Task Handle(ObtainLock message, IMessageHandlerContext context)
        //{
        //    // TODO: what should we do here? Update Saga and DB?
        //}

        List<Guid> ResolveTickets(int numberOfTicketsRequested, IMessageHandlerContext context)
        {
            /// Determine if we can fill out this order
            /// If we can fill out this order, allocate the tickets
            /// Assume that all tickets are contiguous. 
            var availableTicketsCount = this.Data.Tickets.Count - this.Data.AllocatedTickets.Count;
            if (availableTicketsCount < numberOfTicketsRequested)
            {
                //// TODO in this case we cannot allocate the tickets since they've been allocated. 
                // await context.Reply("Tickets not available");
                throw new Exception("Requested number of tickets can not be allocated");
            }

            //// Get the first X number of tickets
            var unAllocatedTickets = this.Data.Tickets.Where(t => this.Data.AllocatedTickets.All(a => a != t.TicketId));
            var listOfTicketsForOrder = unAllocatedTickets.Take(numberOfTicketsRequested).ToList();

            foreach (var tickets in listOfTicketsForOrder)
            {
                this.Data.AllocatedTickets.Add(tickets.TicketId);
            }

            //this.Data.ForTestAllocatedTickets = this.Data.AllocatedTickets;
            //// Allocate these tickets so they don't get selected again.
            //this.Data.AllocatedTickets.AddRange(listOfTicketsForOrder.Select(c => c.TicketId));
            var ticketIdsInOrder = listOfTicketsForOrder.Select(c => c.TicketId).ToList();
            return ticketIdsInOrder;
        }

        public async Task Handle(IHoldTicketsOrderPlaced message, IMessageHandlerContext context)
        {
            try
            {
                var ticketIdsInOrder = ResolveTickets(message.NumberOfTickets, context);
                await context.Publish<ITicketQuantityReduced>(x =>
                                {
                                    x.TicketGroupId = message.TicketGroupId;
                                    x.Tickets = ticketIdsInOrder;
                                });

                await context.Publish<INeedToHoldTickets>(x =>
                {
                    x.TicketGroupId = message.TicketGroupId;
                    x.EventellectOrderId = message.EventellectOrderId;
                    x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                    x.AllocatedTickets = ticketIdsInOrder;
                    x.EventId = this.Data.EventId;
                });
            }
            catch (Exception ex)
            {
                await context.Reply(ex.Message); // Compensating action 
            }

        }

        public async Task Handle(TicketAllocationRequest message, IMessageHandlerContext context)
        {
            Log.Info($" Handling TicketAllocationRequest In the Saga message. NumMsg:{message.NumberOfTickets} TicketGroupId:{message.TicketGroupId} ");

            try
            {
                var ticketIdsInOrder = ResolveTickets(message.NumberOfTickets, context);

                await context.Publish<ITicketsAllocatedToOrder>(x =>
                {
                    x.TicketGroupId = message.TicketGroupId;
                    x.AllocatedTickets = ticketIdsInOrder;
                    x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                    x.EventId = this.Data.EventId;
                 

                });

                await context.Publish<ITicketQuantityReduced>(x =>
                {
                    x.TicketGroupId = message.TicketGroupId;
                    x.Tickets = ticketIdsInOrder;
                    x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                });

                await context.Reply(new TicketAllocationResponse()
                {
                    IsAllocated = true,
                    Tickets = ticketIdsInOrder
                });
                Log.Info($" Tickets have been allocated ");

            }
            catch (Exception ex)
            {
                Log.Info($"{ex.Message } for {message.TicketGroupId}");
                await context.Reply(new TicketAllocationResponse() { IsAllocated = false });
            }


            await CloseOutTicketGroupIfComplete(context);
        }

        public async Task Handle(HoldTickets message, IMessageHandlerContext context)
        {
            var response = new HoldTicketsResponse()
            {
                Response = "",
                MarketplaceId = message.MarketplaceId,
                MarketplaceOrderKey = message.MarketplaceOrderKey,
                NumberOfTickets = message.NumberOfTickets,
                TicketGroupId = message.TicketGroupId,
            };

            try
            {
                Log.Info($"Handling hold ticket command : Publishing ITicketQuantityReduced TicketGroupId {message.TicketGroupId}");
                var ticketIdsInOrder = ResolveTickets(message.NumberOfTickets, context);
                await context.Publish<ITicketQuantityReduced>(x =>
                {
                    x.TicketGroupId = message.TicketGroupId;
                    x.Tickets = ticketIdsInOrder;
                });

                Log.Info($"Handling hold ticket command : Publishing INeedToHoldTickets TicketGroupId {message.TicketGroupId}");
                await context.Publish<INeedToHoldTickets>(x =>
                {
                    x.TicketGroupId = message.TicketGroupId;
                    x.EventellectOrderId = message.EventellectOrderId;
                    x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                    x.AllocatedTickets = ticketIdsInOrder;
                    x.EventId = this.Data.EventId;
                });

                response.Response = "Ticket hold successful";
                await context.Reply(response);
            }
            catch (Exception ex)
            {
                Log.Info($"{ex.Message } for {message.TicketGroupId}");
                response.Response = ex.Message;
                await context.Reply(response);
            }
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
            mapper.ConfigureMapping<TicketAllocationRequest>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
            mapper.ConfigureMapping<IHoldTicketsOrderPlaced>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
            mapper.ConfigureMapping<HoldTickets>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
            mapper.ConfigureMapping<IHoldExpired>(x => x.TicketGroupId).ToSaga(s => s.TicketGroupId);
        }

        public async Task Handle(IHoldExpired message, IMessageHandlerContext context)
        {
            Log.Info($" Handling IHoldExpired In the Saga message. TicketGroupId:{message.TicketGroupId} {message.MarketplaceOrderKey}");



            try
            {
                var holdTickets = this.Data.Tickets.Where(t => message.AllocatedTickets.Any(a => a == t.TicketId)).ToList();
                var isConsecutiveTickets = IsConsecutiveTickets(holdTickets);
                //var listOfTickets = message.Tickets;
                if (isConsecutiveTickets)
                {
                    //foreach (var ticket in listOfTickets)
                    //{
                    // this.Data.AllocatedTickets.Remove(ticket.TicketId);
                    //}
                    this.Data.AllocatedTickets = this.Data.AllocatedTickets.Where(t => holdTickets.All(a => a.TicketId != t)).ToList();



                    await context.Publish<IAvailableTicketsIncreased>(x =>
                    {
                        x.TicketGroupId = message.TicketGroupId;
                        x.AllocatedTickets = this.Data.AllocatedTickets;
                        x.MarketplaceOrderKey = message.MarketplaceOrderKey;
                        x.EventellectOrderId = message.EventellectOrderId;
                    });
                }
                else
                {
                    //this.Data.AllocatedTickets.RemoveAll(x => message.Tickets.Any(y => y.TicketId == x));
                    //this.Data.Tickets.RemoveAll(x => message.Tickets.Any(y => y.TicketId == x.TicketId));
                    //foreach (var ticket in listOfTickets)
                    //{
                    // this.Data.AllocatedTickets.Remove(ticket.TicketId);
                    // this.Data.Tickets.Remove(ticket);
                    //}



                    this.Data.AllocatedTickets = this.Data.AllocatedTickets.Where(t => holdTickets.All(a => a.TicketId != t)).ToList();
                    this.Data.Tickets = this.Data.Tickets.Where(t => holdTickets.All(a => a != t)).ToList();



                    await context.Send(new AddTicketGroupToInventory() { Tickets = holdTickets });
                    await context.Publish<ITicketsOffered>(x =>
                    {
                        x.Tickets = this.Data.Tickets;
                    });
                }
            }
            catch (Exception ex)
            {
                await context.Reply(ex.Message);
            }
        }



        private bool IsConsecutiveTickets(IEnumerable<Tickets> tickets)
        {
            var seatList = new List<int>();
            //To DO
            foreach (var ticket in tickets)
            {
                foreach (var t in tickets)
                {
                    if (ticket.Row != t.Row)
                    {
                        return false;
                    }
                    seatList.Add(t.Seat);
                }
                break;
            }
            seatList.Sort();

            int start = seatList.First();
            return !seatList.Where((x, i) => x != i + start).Any();
        }
    }
}
