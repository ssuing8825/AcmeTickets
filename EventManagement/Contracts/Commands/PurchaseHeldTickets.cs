using System;
using System.Collections.Generic;

namespace AcmeTickets.EventManagement.Contracts.Commands;

public class PurchaseHeldTickets
{
    public int MarketplaceId { get; set; }

    public Guid TicketGroupId { get; set; }

    public List<Guid> AllocatedTickets { get; set; }

    // This comes from the market place
    public Guid MarketplaceOrderKey { get; set; }

    // This comes from when we create the order in EVT
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