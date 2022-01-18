using NServiceBus;
using System;
using System.Collections.Generic;

namespace Function.Fulfillment.Sagas.Data
{
    public class TicketHoldPolicyData : IContainSagaData
    {
        public Guid TicketGroupId { get; set; }
        public List<Guid> AllocatedTickets { get; set; }
        public Guid Id { get; set; }
        public string Originator { get; set; }
        public string OriginalMessageId { get; set; }
    }
}
