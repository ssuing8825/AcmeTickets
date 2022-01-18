using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.Fulfillment.Contracts.Events
{
    public interface IOrderFulfilled : IEvent
    {
        public Guid EventId { get; set; }
        public Guid TicketGroupId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }
    }
}
