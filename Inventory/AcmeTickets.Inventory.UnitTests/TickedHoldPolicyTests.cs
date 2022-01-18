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

namespace AcmeTickets.Inventory.UnitTests
{
    public class TickedHoldPolicyTests
    {
        [Fact]
        public async void ShouldProcessTicketHold()
        {
            // TODO: Create individual tests.

            // arrange
            var saga = new TicketHoldPolicy
            {
                Data = new TicketHoldPolicyData()
            };

            var context = new TestableMessageHandlerContext();

            INeedToHoldTickets needToHoldTickets = CreateNeedToHoldTicketsEvent();

            // act
            await saga.Handle(needToHoldTickets, context).ConfigureAwait(false);

            // assert
            Assert.Single(context.PublishedMessages);
            Assert.IsAssignableFrom<ITicketsHeld>(context.PublishedMessages[0].Message);
            Assert.Single(context.TimeoutMessages);
            Assert.IsAssignableFrom<TicketHoldExpired>(context.TimeoutMessages[0].Message);
            Assert.False(saga.Completed);


            // arrange
            var heldTicketsPurchased = CreateHeldTicketsPurchasedEvent(needToHoldTickets);

            // act
            await saga.Handle(heldTicketsPurchased, context).ConfigureAwait(false);

            // assert
            Assert.Equal(2, context.PublishedMessages.Length);
            Assert.IsAssignableFrom<ITicketsAllocatedToOrder>(context.PublishedMessages[1].Message);
            Assert.True(saga.Completed);

        }

        [Fact]
        public async void ShouldRaiseHoldExpiredEventWhenWhenTicketHoldIsExpiredTimeoutOccurs()
        {
            // arrange
            var saga = new TicketHoldPolicy
            {
                Data = new TicketHoldPolicyData
                {

                    TicketGroupId = Guid.NewGuid(),
                    AllocatedTickets = new List<Guid>
                {
                    Guid.NewGuid(),
                    Guid.NewGuid()
                },
                    MarketplaceOrderKey = Guid.NewGuid(),
                    EventellectOrderId = Guid.NewGuid()
                }
            };

            var context = new TestableMessageHandlerContext();
            var ticketHoldExpired = new TicketHoldExpired();

            // act
            await saga.Timeout(ticketHoldExpired, context).ConfigureAwait(false);

            // assert

            Assert.Single(context.PublishedMessages);
            Assert.IsAssignableFrom<IHoldExpired>(context.PublishedMessages[0].Message);
            Assert.True(saga.Completed);
            var actualHoldExpiredEvent = (IHoldExpired)context.PublishedMessages[0].Message;
            Assert.Equal(saga.Data.MarketplaceOrderKey, actualHoldExpiredEvent.MarketplaceOrderKey);

        }

        [Fact]
        public async void ShouldRaiseHoldExpiredEventAndCompleteWhenWhenICancelOrderEventIsHandled()
        {
            // arrange
            var saga = new TicketHoldPolicy
            {
                Data = new TicketHoldPolicyData
                {

                    TicketGroupId = Guid.NewGuid(),
                    AllocatedTickets = new List<Guid>
                    {
                        Guid.NewGuid(),
                        Guid.NewGuid()
                    },
                    MarketplaceOrderKey = Guid.NewGuid(),
                    EventellectOrderId = Guid.NewGuid()
                }
            };

            var context = new TestableMessageHandlerContext();


            // act
            await saga.Handle(CreateOrderCancelledEvent(), context).ConfigureAwait(false);

            // assert
            Assert.Single(context.PublishedMessages);
            Assert.IsAssignableFrom<IHoldExpired>(context.PublishedMessages[0].Message);
            Assert.True(saga.Completed);
        }


        [Fact]
        public async void ShouldNotRaiseHoldExpiredEventWhenWhenNeedMoreHoldTimeEventIsHandled()
        {
            // this test tests for "HoldExpired" not TicketHoldExpiredTimeout

            // arrange
            var saga = new TicketHoldPolicy
            {
                Data = new TicketHoldPolicyData
                {
                    TicketGroupId = Guid.NewGuid(),
                    AllocatedTickets = new List<Guid>
                    {
                        Guid.NewGuid(),
                        Guid.NewGuid()
                    },
                    MarketplaceOrderKey = Guid.NewGuid(),
                    EventellectOrderId = Guid.NewGuid(),
                    NoOfHoldsRequestByMarketPlace = 0,
                    MarketPlaceRequestMoreTime = false
                }
            };

            var context = new TestableMessageHandlerContext();
            var needToIncreaseHoldTimeoutEvent = CreateNeedToIncreaseHoldTimeoutEvent();

            // act
            await saga.Handle(needToIncreaseHoldTimeoutEvent, context).ConfigureAwait(false);

            // assert
            Assert.False(saga.Completed);
            Assert.Equal(1, saga.Data.NoOfHoldsRequestByMarketPlace);
            Assert.True(saga.Data.MarketPlaceRequestMoreTime);


            // Simulating a Timeout event, keeping the same context
            var ticketHoldExpired = new TicketHoldExpired();

            // act
            await saga.Timeout(ticketHoldExpired, context).ConfigureAwait(false);

            // assert
            Assert.False(saga.Completed);
            Assert.False(saga.Data.MarketPlaceRequestMoreTime);
            Assert.Single(context.TimeoutMessages);
            Assert.IsAssignableFrom<TicketHoldExpired>(context.TimeoutMessages[0].Message);
        }


        private static INeedToHoldTickets CreateNeedToHoldTicketsEvent()
        {
            var messageMapper = new MessageMapper();
            var needToHoldTickets = messageMapper.CreateInstance<INeedToHoldTickets>();

            needToHoldTickets.TicketGroupId = Guid.NewGuid();
            needToHoldTickets.AllocatedTickets = new List<Guid>
                {
                    Guid.NewGuid(),
                    Guid.NewGuid(),
        };
            needToHoldTickets.MarketplaceOrderKey = Guid.NewGuid();
            needToHoldTickets.EventellectOrderId = Guid.NewGuid();
            return needToHoldTickets;
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

        private static IOrderCancelled CreateOrderCancelledEvent()
        {
            var messageMapper = new MessageMapper();
            var message = messageMapper.CreateInstance<IOrderCancelled>();

            message.TicketGroupId = Guid.NewGuid();
            message.AllocatedTickets = new List<Guid>
            {
                Guid.NewGuid(),
                Guid.NewGuid(),
            };
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