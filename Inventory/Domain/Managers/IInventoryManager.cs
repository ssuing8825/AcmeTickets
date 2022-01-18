using AcmeTickets.Inventory.Contracts.Commands;
using AcmeTickets.Inventory.Domain.Managers.Entities;
using NServiceBus;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AcmeTickets.Inventory.Domain.Managers
{
    public interface IInventoryManager
    {
        Task<Guid> AddTicketGroupToInventoryAsync(AddTicketGroupToInventory message);
        Task<List<Tickets>> GetTicketsByIds(List<Guid> ticketIds, Guid ticketGroupId);
        Task<TicketGroup> GetTicketGroupById(Guid ticketGroupId);
    }
}