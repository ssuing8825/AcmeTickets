using System;

namespace AcmeTickets.Inventory.Contracts.Commands
{
    public class TicketAllocationRequest
    {
        public Guid TicketGroupId { get; set; }

        public int NumberOfTickets { get; set; }

        public Guid MarketplaceOrderKey { get; set; }
    }
}
