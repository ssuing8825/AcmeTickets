using AcmeTickets.EventManagement.Domain.Managers.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB
{
    public interface IEventRepository : IGenericRepository<Event>
    {
    }
}
