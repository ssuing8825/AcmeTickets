using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Contracts.Events
{
    public interface IHoldTicketsOrderPlaced : IEvent
    {
        Guid TicketGroupId { get; set; }
        public int NumberOfTickets { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }
    }
}
