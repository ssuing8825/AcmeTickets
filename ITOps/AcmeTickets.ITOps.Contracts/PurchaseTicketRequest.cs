using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.ITOps.Contracts
{
    public class PurchaseTicketRequest
    {
        public int MarketplaceId { get; set; }

        public Guid TicketGroupId { get; set; }

        public int NumberOfTickets { get; set; }

        // TODO: Where do we need to go get this from, will marketplace provide this to us?
        public Guid MarketplaceOrderKey { get; set; }

        public bool NeedsAdditionalMarketplaceDataForFutureProcessing { get; set; }

        public bool IsValid()
        {
            if (MarketplaceOrderKey == Guid.Empty)
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
