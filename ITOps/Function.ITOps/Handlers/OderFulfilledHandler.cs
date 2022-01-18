using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Domain.Managers;
using AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB;
using AcmeTickets.Fulfillment.Contracts.Events;
using AcmeTickets.EventManagement.Integration;
using AcmeTickets.ITOps.Integration.Commands;
using AcmeTickets.Inventory.Integration;
using AcmeTickets.Inventory.Domain.Managers;

namespace Function.ITOps.Handlers.Marketplace
{
    internal class OderFulfilledHandler : IHandleMessages<IOrderFulfilled>
    {
        private IProvideEventInfo _provideEventInfo;
        private IProvideTicketsInfo _provideTicketsInfo;
        static ILog Log = LogManager.GetLogger(typeof(IOrderFulfilled));

        public OderFulfilledHandler()
        {
            // TODO: fix this with DI
            _provideEventInfo = new EventInfoProvider(new EventManager());
            _provideTicketsInfo = new TicketsInfoProvider(new InventoryManager());
        }

        public async Task Handle(IOrderFulfilled message, IMessageHandlerContext context)
        {
            Log.Info($"IOrderFulfilled handled in {this.GetType()} EventId: {message.EventId}");

            var eventDetails = await _provideEventInfo.GetEventInfo(message.EventId);
            var tickets = await _provideTicketsInfo.GetTicketsInfo(message.AllocatedTickets, message.TicketGroupId);
        }
    }
}
