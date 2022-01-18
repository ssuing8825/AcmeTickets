using NServiceBus;
using System;
using System.Collections.Generic;

namespace AcmeTickets.Inventory.Contracts.Events
{
    public interface ITicketsHeld : IEvent
    {
        public Guid TicketGroupId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }
    }
}
