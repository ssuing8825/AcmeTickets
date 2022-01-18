using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Contracts.Messages
{
    public class MarketplaceTicketGroupIdResponse
    {
        public int MarketplaceId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid TicketGroupId { get; set; }
        public string Response { get; set; }
    }
}
