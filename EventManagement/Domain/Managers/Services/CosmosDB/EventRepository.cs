using AcmeTickets.EventManagement.Domain.Managers.Entities;
using Microsoft.Azure.Cosmos;

namespace AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB
{
    public class EventRepository : GenericRepository<Event>, IEventRepository
    {
        public readonly CosmosClient _cosmosClient;
        public readonly Container _container;

        public override string DatabaseId => "Samples.CosmosDB.Simple";
        public override string ContainerId => "Event";

        public EventRepository(CosmosClient cosmosClient) : base(cosmosClient)
        {
            _cosmosClient = cosmosClient;
            _container = cosmosClient.GetContainer(DatabaseId, ContainerId);
        }
    }
}
