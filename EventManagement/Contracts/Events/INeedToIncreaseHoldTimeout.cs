using System;
using System.Collections.Generic;
using NServiceBus;

namespace AcmeTickets.EventManagement.Contracts.Events;

public interface INeedToIncreaseHoldTimeout : IEvent
{
    public Guid TicketGroupId { get; set; }
    public List<Guid> AllocatedTickets { get; set; }
    public Guid EventellectOrderId { get; set; }
    public Guid MarketplaceOrderKey { get; set; }
}