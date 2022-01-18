using NServiceBus;
using System;

namespace AcmeTickets.EventManagement.Contracts.Commands
{
    public class PurchaseAllocatedTickets 
    {
        public int MarketplaceId { get; set; }

        public Guid TicketGroupId { get; set; }

        public int NumberOfTickets { get; set; }

        // TODO: Where do we need to go get this from, will marketplace provide this to us?
        public Guid MarketplaceOrderKey { get; set; }

        public bool NeedsAdditionalMarketplaceDataForFutureProcessing { get; set; }

        public bool IsValid()
        {
            if (TicketGroupId == Guid.Empty)
                return false;
            return true;
        }

        public bool NeedsAugmented()
        {
            if (this.NeedsAdditionalMarketplaceDataForFutureProcessing)
                return true;
            return false;
        }
    }
}
