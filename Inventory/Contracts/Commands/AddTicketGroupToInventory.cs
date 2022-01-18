using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.Inventory.Contracts.Commands
{
    public class AddTicketGroupToInventory : ICommand
    {
        public Guid EventId { get; set; }
        public List<Tickets> Tickets { get; set; }
    }
}
