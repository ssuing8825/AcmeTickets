using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Events;
using System;
using AcmeTickets.EventManagement.Contracts.Messages;
using AcmeTickets.ITOps.Contracts.Messages;
using AcmeTickets.Inventory.Contracts.Commands;
using AcmeTickets.EventManagement.Domain.Managers;

namespace AcmeTickets.EventManagement.Function.Purchase.Handlers
{
    public class AddEventHandler : IHandleMessages<AddEvent>
    {
        static ILog Log = LogManager.GetLogger(typeof(AddEventHandler));
        private readonly IEventManager _eventManager;


        public AddEventHandler(IEventManager eventManager)
        {
            _eventManager = eventManager;
        }

        public async Task Handle(AddEvent message, IMessageHandlerContext context)
        {
            await _eventManager.AddEventAsync(message);

            Log.Info($"Handling Add Event command.");
            await context.Publish<IEventAdded>(x =>
            {
                x.EventId = message.EventId;
            });
        }
    }
}
