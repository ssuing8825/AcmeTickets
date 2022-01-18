using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.Inventory.Contracts.Events
{
    public interface IEventTicketGroupCreated : IEvent
    {
        public Guid TicketGroupId { get; set; }
        public List<Tickets> Tickets { get; set; }
        public Guid EventId { get; set; }
    }
}
