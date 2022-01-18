using AcmeTickets.Inventory.Contracts;
using AcmeTickets.Inventory.Domain.Managers;
using AcmeTickets.ITOps.Integration.Commands;
using NServiceBus.Logging;

namespace AcmeTickets.Inventory.Integration
{
    public class TicketsInfoProvider : IProvideTicketsInfo
    {
        static ILog Log = LogManager.GetLogger(typeof(TicketsInfoProvider));
        private readonly InventoryManager _inventoryManager;


        public TicketsInfoProvider(InventoryManager inventoryManager)
        {
            _inventoryManager = inventoryManager;
        }


        async Task<List<Tickets>> IProvideTicketsInfo.GetTicketsInfo(List<Guid> ticketIds, Guid ticketGroupId)
        {
            var t = await _inventoryManager.GetTicketsByIds(ticketIds, ticketGroupId);
            var tickets = new List<Tickets>();

            foreach (var ticket in t)
            {
                tickets.Add(new Tickets() { Row = ticket.Row, Seat = ticket.Seat, TicketId = Guid.Parse(ticket.Id) });
            }
            return tickets;
        }
    }
}