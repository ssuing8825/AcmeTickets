using NServiceBus;
using System;
using System.Collections.Generic;

namespace AcmeTickets.Inventory.Contracts.Events
{
    public interface ITicketsAllocatedToOrder : IEvent
    {
        public Guid TicketGroupId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }
        public Guid EventId { get; set; }
    }
}
