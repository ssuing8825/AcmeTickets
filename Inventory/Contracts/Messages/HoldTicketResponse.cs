using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.Inventory.Contracts.Messages
{
    public class HoldTicketsResponse
    {
        public int MarketplaceId { get; set; }

        public Guid TicketGroupId { get; set; }

        public int NumberOfTickets { get; set; }

        // TODO: Where do we need to go get this from, will marketplace provide this to us?
        public Guid MarketplaceOrderKey { get; set; }

        public string Response { get; set; }
    }

    public class TicketAllocationResponse
    {
        public List<Guid> Tickets { get; set; }

        // TODO: Where do we need to go get this from, will marketplace provide this to us?
        public Guid MarketplaceOrderKey { get; set; }

        public bool IsAllocated { get; set; }
    }
}
