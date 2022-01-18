using NServiceBus;
using System;
using System.Collections.Generic;

namespace AcmeTickets.EventManagement.Contracts.Events
{
    public interface IHeldTicketsPurchased : IEvent
    {
        public Guid TicketGroupId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }
    }
}
