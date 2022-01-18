using System;

namespace AcmeTickets.Fulfillment.Contracts
{
    public class Tickets
    {
        public Guid TicketId { get; set; }
        public string Row { get; set; }
        public int Seat { get; set; }
    }
}
