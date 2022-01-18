using NServiceBus;
using System;

namespace AcmeTickets.EventManagement.Contracts.Messages
{
    public class PurchaseTicketsResponse : IMessage
    {
        public int MarketplaceId { get; set; }

        public Guid TicketGroupId { get; set; }

        public int NumberOfTickets { get; set; }

        // TODO: Where do we need to go get this from, will marketplace provide this to us?
        public Guid MarketplaceOrderKey { get; set; }

        public string Response { get; set; }
    }

    
    
}
