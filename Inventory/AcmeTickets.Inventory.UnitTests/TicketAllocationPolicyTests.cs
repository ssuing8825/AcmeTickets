using Xunit;
using Function.Inventory.Sagas;
using Function.Inventory.Sagas.Data;
using AcmeTickets.Inventory.Internal.Contracts.Events;
using NServiceBus.Testing;
using NServiceBus.MessageInterfaces.MessageMapper.Reflection;
using AcmeTickets.Inventory.Contracts.Events;
using AcmeTickets.EventManagement.Contracts.Events;
using System;
using System.Collections.Generic;
using AcmeTickets.Inventory.Contracts;
using AcmeTickets.Inventory.Contracts.Commands;

namespace AcmeTickets.Inventory.UnitTests
{
    public class TickedAllocationPolicyTests
    {
        [Fact]
        public async void ShouldProcessTicketAllocation()
        {
            // TODO: Create individual tests.

            // arrange
            var saga = new TicketAllocationPolicy()
            {
                Data = new TicketAllocationPolicyData()
            };

            var context = new TestableMessageHandlerContext();

            IEventTicketGroupCreated eventTicketGroupCreated = CreateIEventTicketGroupCreatedEvent();

            await saga.Handle(eventTicketGroupCreated, context);

            /// TODO Need to add asserts

            await saga.Handle(new TicketAllocationRequest { MarketplaceOrderKey = Guid.NewGuid(), NumberOfTickets = 1, TicketGroupId = Guid.NewGuid() },
                context);
            /// TODO Need to add asserts


            await saga.Handle(new TicketAllocationRequest { MarketplaceOrderKey = Guid.NewGuid(), NumberOfTickets = 1, TicketGroupId = Guid.NewGuid() }, context);
            /// TODO Need to add asserts

            // await saga.Handle(new TicketAllocationRequest { MarketplaceOrderKey = Guid.NewGuid(), NumberOfTickets = 1, TicketGroupId = Guid.NewGuid() }, context);





        }

        [Fact]
        public async void ShouldProcessTicketReAllocation()
        {
            // TODO: Create individual tests.

            // arrange
            var saga = new TicketAllocationPolicy()
            {
                Data = new TicketAllocationPolicyData()
            };

            var context = new TestableMessageHandlerContext();

            IEventTicketGroupCreated eventTicketGroupCreated = CreateIEventTicketGroupCreatedEvent();

            await saga.Handle(eventTicketGroupCreated, context);

            /// TODO Need to add asserts

            //await saga.Handle(
            //    new TicketAllocationRequest
            //    { MarketplaceOrderKey = Guid.NewGuid(), NumberOfTickets = 1, TicketGroupId = Guid.NewGuid() },
            //    context);

            await saga.Handle(CreateIHoldTicketsOrderPlaced(), context);
            /// TODO Need to add assert
            //var ticketA = new List<Guid>();
            //var dta = saga.Data.AllocatedTickets.Find(x => x.ToString() == "750e65d1-771a-4511-bcd9-92c1abf00d0b");
            //var dta2 = saga.Data.AllocatedTickets.Find(x => x.ToString() == "054c2b8e-b701-4305-9814-0a30132a4af6");
            //ticketA.Add(dta);
            //ticketA.Add(dta2);
            await saga.Handle(CreateIHoldExpired(saga.Data.AllocatedTickets), context);

        }


        private static IEventTicketGroupCreated CreateIEventTicketGroupCreatedEvent()
        {
            var messageMapper = new MessageMapper();
            var message = messageMapper.CreateInstance<IEventTicketGroupCreated>();

            message.TicketGroupId = Guid.NewGuid();
            message.Tickets = new List<Tickets>();

            var tickets = new Tickets
            {
                Row = "1",
                Seat = 1,
                TicketId = Guid.NewGuid()
            };

            message.Tickets.Add(tickets);


            var tickets2 = new Tickets
            {
                Row = "1",
                Seat = 3,
                TicketId = Guid.NewGuid()
            };

            message.Tickets.Add(tickets2);

            var tickets3 = new Tickets
            {
                Row = "1",
                Seat = 2,
                TicketId = Guid.NewGuid()
            };

            message.Tickets.Add(tickets3);


            return message;
        }

        private static INeedToIncreaseHoldTimeout CreateNeedToIncreaseHoldTimeoutEvent()
        {
            var messageMapper = new MessageMapper();
            var message = messageMapper.CreateInstance<INeedToIncreaseHoldTimeout>();

            message.TicketGroupId = Guid.NewGuid();
            message.AllocatedTickets = new List<Guid>
            {
                Guid.NewGuid(),
                Guid.NewGuid(),
            };
            message.MarketplaceOrderKey = Guid.NewGuid();
            message.EventellectOrderId = Guid.NewGuid();
            return message;
        }

        private static IHoldTicketsOrderPlaced CreateIHoldTicketsOrderPlaced()
        {
            var messageMapper = new MessageMapper();
            var message = messageMapper.CreateInstance<IHoldTicketsOrderPlaced>();

            message.TicketGroupId = Guid.NewGuid();
            message.NumberOfTickets = 2;
            message.MarketplaceOrderKey = Guid.NewGuid();
            message.MarketplaceOrderKey = Guid.NewGuid();
            return message;
        }

        private static IHoldExpired CreateIHoldExpired(List<Guid> allocatecTickets)
        {
            var messageMapper = new MessageMapper();
            var message = messageMapper.CreateInstance<IHoldExpired>();

            message.TicketGroupId = Guid.NewGuid();
            message.AllocatedTickets = allocatecTickets;

            message.MarketplaceOrderKey = Guid.NewGuid();
            message.MarketplaceOrderKey = Guid.NewGuid();
            return message;
        }


        private static IHeldTicketsPurchased CreateHeldTicketsPurchasedEvent(INeedToHoldTickets needToHoldTickets)
        {
            var messageMapper = new MessageMapper();
            var heldTicketsPurchased = messageMapper.CreateInstance<IHeldTicketsPurchased>();

            heldTicketsPurchased.TicketGroupId = needToHoldTickets.TicketGroupId;
            heldTicketsPurchased.AllocatedTickets = needToHoldTickets.AllocatedTickets;
            heldTicketsPurchased.MarketplaceOrderKey = needToHoldTickets.MarketplaceOrderKey;
            heldTicketsPurchased.EventellectOrderId = needToHoldTickets.EventellectOrderId;
            return heldTicketsPurchased;
        }
    }
}
