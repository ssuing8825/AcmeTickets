using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.Inventory.Contracts.Messages
{
    public class PurchaseTicketsSyncResponse
    {
        public int MarketplaceId { get; set; }

        public Guid TicketGroupId { get; set; }

        public int NumberOfTickets { get; set; }

        public Guid MarketplaceOrderKey { get; set; }

        public string Response { get; set; }
    }
}
