using AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB;
using System;

namespace AcmeTickets.EventManagement.Domain.Managers.Entities
{
    public class Event : Entity
    {
        public Event() : base(true)
        {
        }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; } 
    }
}
