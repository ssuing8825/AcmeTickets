using System;

namespace AcmeTickets.EventManagement.Contracts.Commands;

public class CancelOrder
{
    public Guid MarketplaceOrderKey { get; set; }

    // TODO: Where do we need to go get this from, will marketplace provide this to us?
    public Guid EventellectOrderId { get; set; }


    public bool IsValid()
    {
        if (MarketplaceOrderKey == Guid.Empty)
            return false;
        return true;
    }
}