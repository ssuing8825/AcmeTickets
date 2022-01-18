using AcmeTickets.EventManagement.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.ITOps.Integration.Commands
{
    public interface IProvideEventInfo
    {
        Task<Event> GetEventInfo(Guid eventId);
    }
}
