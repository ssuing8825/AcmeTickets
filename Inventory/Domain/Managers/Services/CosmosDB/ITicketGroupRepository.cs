using AcmeTickets.Inventory.Domain.Managers.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.Inventory.Domain.Managers.Services.CosmosDB
{
    public interface ITicketGroupRepository : IGenericRepository<TicketGroup>
    {
    }
}
