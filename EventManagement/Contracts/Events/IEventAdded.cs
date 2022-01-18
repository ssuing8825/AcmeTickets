using NServiceBus;
using System;
using System.Collections.Generic;

namespace AcmeTickets.EventManagement.Contracts.Events
{
    public interface IEventAdded 
    {
        public Guid EventId { get; set; }
    }
}
