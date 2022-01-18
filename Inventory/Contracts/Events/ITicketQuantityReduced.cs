using NServiceBus;
using System;
using System.Collections.Generic;

namespace AcmeTickets.Inventory.Contracts.Events
{
    public interface ITicketQuantityReduced : IEvent
    {
        public Guid TicketGroupId { get; set; }
        
        public List<Guid> Tickets { get; set; }

        public Guid MarketplaceOrderKey { get; set; }
    }
}
