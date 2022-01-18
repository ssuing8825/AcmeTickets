using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Domain.Managers.Entities;
using NServiceBus;
using System;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Domain.Managers
{
    public interface IEventManager
    {
        Task AddEventAsync(AddEvent message);

        Task<Event> GetEventByEventId(Guid EventId);
    }
}