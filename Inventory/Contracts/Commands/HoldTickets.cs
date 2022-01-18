using System;

namespace AcmeTickets.Inventory.Contracts.Commands
{
    public class HoldTickets
    {
        public int MarketplaceId { get; set; }

        public Guid TicketGroupId { get; set; }

        public int NumberOfTickets { get; set; }

        public Guid MarketplaceOrderKey { get; set; }
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

}
