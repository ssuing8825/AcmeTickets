using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Domain.Managers.Entities;
using AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB;
using Microsoft.Azure.Cosmos;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Domain.Managers
{
    public class EventManager : IEventManager
    {
        private readonly IEventRepository _eventRepository;

        public EventManager(IEventRepository ticketGroupRepository)
        {
            _eventRepository = ticketGroupRepository;
        }

        public EventManager()
        {
            // TODO: Remove this default constructor
            string databaseName = "Samples.CosmosDB.Simple";
            string containerName = "Event";
            string account = "https://eventellectdb.documents.azure.com:443";
            string key = "Yiuw9cYJPZKPEbumKW2SbE2lf7lS8g966TSWn2kZoswgcbbXxIbJUh2dApZaeWaap2CdcL6NPaeIkMLdpCef0w==";
            var connection = $"AccountEndpoint={account}/;AccountKey={key};";
            var client = new CosmosClient(connection,
            new CosmosClientOptions
            {
                SerializerOptions = new CosmosSerializationOptions
                {
                    Indented = true
                }
            });
            var database = client.CreateDatabaseIfNotExistsAsync(databaseName).Result;
            database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");
            _eventRepository = new EventRepository(client);
        }

        public async Task AddEventAsync(AddEvent message)
        {
            //// In this case the ID is created by the caller before it's sent in
            //// That provides a lot of flexibility.
            var ticketEvent = new Event()
            {
                Id = message.EventId.ToString(),
                EventDate = message.EventDate,
                EventName = message.EventName
            };

            await _eventRepository.AddAsync(ticketEvent, message.EventId.ToString());

        }

        public async Task<Event> GetEventByEventId(Guid EventId)
        {
            return await _eventRepository.GetByIdAsync(EventId.ToString(), EventId.ToString());
        }
    }
}
