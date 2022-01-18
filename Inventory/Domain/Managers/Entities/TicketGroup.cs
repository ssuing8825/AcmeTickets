using AcmeTickets.Inventory.Domain.Managers.Services.CosmosDB;
using System;
using System.Collections.Generic;

namespace AcmeTickets.Inventory.Domain.Managers.Entities
{
    public class TicketGroup : Entity
    {
        public TicketGroup() : base(true)
        {
        }

        public Guid EventId { get; set; }
        public List<Tickets> Tickets { get; set; }
    }
}
