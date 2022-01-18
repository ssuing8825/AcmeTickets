using NServiceBus;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace AcmeTickets.Inventory.Internal.Contracts.Events
{
    public interface INeedToHoldTickets : IEvent
    {
        public Guid TicketGroupId { get; set; }
        public Guid EventId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }

    }
}
