using AcmeTickets.Inventory.Domain.Managers.Entities;
using Microsoft.Azure.Cosmos;

namespace AcmeTickets.Inventory.Domain.Managers.Services.CosmosDB
{
    public class TicketGroupRepository : GenericRepository<TicketGroup>, ITicketGroupRepository
    {
        public readonly CosmosClient _cosmosClient;
        public readonly Container _container;

        public override string DatabaseId => "Samples.CosmosDB.Simple";
        public override string ContainerId => "Inventory";

        public TicketGroupRepository(CosmosClient cosmosClient) : base(cosmosClient)
        {
            _cosmosClient = cosmosClient;
            _container = cosmosClient.GetContainer(DatabaseId, ContainerId);
        }
    }
}
