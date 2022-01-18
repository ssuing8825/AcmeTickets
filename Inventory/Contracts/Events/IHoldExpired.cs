using NServiceBus;
using System;
using System.Collections.Generic;

namespace AcmeTickets.Inventory.Contracts.Events
{
    public class IHoldExpired : IEvent
    {
        public Guid TicketGroupId { get; set; }
        public List<Tickets> Tickets { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }

    }
}
