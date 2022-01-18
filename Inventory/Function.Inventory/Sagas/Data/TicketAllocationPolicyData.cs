using AcmeTickets.Inventory.Contracts;
using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Function.Inventory.Sagas.Data
{
    public class TicketAllocationPolicyData : IContainSagaData
    {
        public Guid TicketGroupId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public List<Tickets> Tickets { get; set; }

        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string Originator { get; set; }
        public string OriginalMessageId { get; set; }
    }
}
