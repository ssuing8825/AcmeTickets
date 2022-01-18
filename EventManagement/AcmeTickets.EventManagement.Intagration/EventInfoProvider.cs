using AcmeTickets.EventManagement.Contracts;
using AcmeTickets.EventManagement.Domain.Managers;
using AcmeTickets.ITOps.Integration.Commands;
using NServiceBus.Logging;

namespace AcmeTickets.EventManagement.Integration
{
    public class EventInfoProvider : IProvideEventInfo
    {
        static ILog Log = LogManager.GetLogger(typeof(EventInfoProvider));
        private readonly IEventManager _eventManager;


        public EventInfoProvider(IEventManager eventManager)
        {
            _eventManager = eventManager;
        }

        public async Task<Event> GetEventInfo(Guid eventId)
        {
            Log.Info($"EventManagement.Integration:GetEventInfo {eventId}");
            var e = await _eventManager.GetEventByEventId(eventId);
            return new Event()
            {
                EventId = Guid.Parse(e.Id),
                EventDate = e.EventDate,
                EventName = e.EventName,
            };
        }
    }
}