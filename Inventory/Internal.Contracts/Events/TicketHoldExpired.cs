using NServiceBus;
using System;
using System.Collections.Generic;
namespace AcmeTickets.Inventory.Internal.Contracts.Events
{
    public class TicketHoldExpired : IEvent
    {
        // Internal Timeout specific to the saga, if the handler needs any properties Saga data can be used.

    }


}