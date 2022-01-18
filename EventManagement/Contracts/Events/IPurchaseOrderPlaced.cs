using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Contracts.Events
{
    public interface IPurchaseOrderPlaced : IEvent
    {
        //TODO determine properties
        public int MarketplaceId { get; set; }
        public Guid TicketGroupId { get; set; }
        public int NumberOfTickets { get; set; }

        //TODO: which orderId is this? Eventellect or Marketplace?
        public Guid OrderId { get; set; }
        public Guid EventellectOrderId { get; set; }
    }
}
