using System;
using System.Collections.Generic;

namespace AcmeTickets.EventManagement.Contracts.Commands;

public class IncreaseHoldTimeout
{
    public int MarketplaceId { get; set; }

    public Guid TicketGroupId { get; set; }

    public List<Guid> AllocatedTickets { get; set; }

    // TODO: Where do we need to go get this from, will marketplace provide this to us?
    public Guid MarketplaceOrderKey { get; set; }

    // TODO: Where do we need to go get this from, will marketplace provide this to us?
    public Guid EventellectOrderId { get; set; }


    public bool IsValid()
    {
        if (TicketGroupId == Guid.Empty)
            return false;
        return true;
    }

    public bool NeedsAugmented()
    {
        if (TicketGroupId == Guid.Empty)
            return true;
        return false;
    }
}