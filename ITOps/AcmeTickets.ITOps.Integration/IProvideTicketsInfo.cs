using AcmeTickets.Inventory.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.ITOps.Integration.Commands
{
    public interface IProvideTicketsInfo
    {
        Task<List<Tickets>> GetTicketsInfo(List<Guid> ticketIds, Guid ticketGroupId);
    }
}
