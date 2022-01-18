using NServiceBus;
using System;
using System.Collections.Generic;

namespace Function.Inventory.Sagas.Data
{
    public class TicketHoldPolicyData : IContainSagaData
    {
        public Guid TicketGroupId { get; set; }
        public Guid EventId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid EventellectOrderId { get; set; }
        public Guid MarketplaceOrderKey { get; set; }
        public Guid Id { get; set; }
        public string Originator { get; set; }
        public string OriginalMessageId { get; set; }

        public bool MarketPlaceRequestMoreTime { get; set; }

        public int NoOfHoldsRequestByMarketPlace { get; set; }

    }
}
