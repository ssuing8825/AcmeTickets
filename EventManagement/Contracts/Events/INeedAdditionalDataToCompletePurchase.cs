using NServiceBus;
using System;

namespace AcmeTickets.EventManagement.Contracts.Events
{
    public interface INeedAdditionalDataToCompletePurchase : IEvent
    {
        //TODO determine properties
        int MarketplaceId { get; set; }
        Guid TicketGroupId { get; set; }
        int NumberOfTickets { get; set; }

        // TODO: is it MarketplaceOrderKey?
        Guid OrderId { get; set; }

        Decimal MarketplacePrice{ get; set; }

    }

}
