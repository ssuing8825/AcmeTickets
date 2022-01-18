using NServiceBus;

namespace AcmeTickets.ITOps.Contracts.Messages
{
    public class OrderDataRetrieved : IMessage
    {
        public List<Guid>? AllocatedTickets { get; set; }

        //TODO determine properties
        public Guid TicketGroupId { get; set; }

        //TODO: is the marketplaceOderId?
        public Guid OrderId { get; set; }
        public Decimal MarketplacePrice { get; set; }
        public int NumberOfTicketsRequested { get; set; }

    }
}