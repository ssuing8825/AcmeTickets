using AcmeTickets.Inventory.Contracts.Commands;
using AcmeTickets.Inventory.Domain.Managers.Entities;
using AcmeTickets.Inventory.Domain.Managers.Services.CosmosDB;
using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AcmeTickets.Inventory.Domain.Managers
{
    public class InventoryManager : IInventoryManager
    {

        private readonly ITicketGroupRepository _ticketGroupRepository;

        public InventoryManager(ITicketGroupRepository ticketGroupRepository)
        {
            _ticketGroupRepository = ticketGroupRepository;
        }

        public InventoryManager()
        {
            // TODO: Remove this default constructor
            string databaseName = "Samples.CosmosDB.Simple";
            string containerName = "Inventory";
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
            _ticketGroupRepository = new TicketGroupRepository(client);
        }

        public async Task<Guid> AddTicketGroupToInventoryAsync(AddTicketGroupToInventory message)
        {
            var ticketGroup = new TicketGroup()
            {
                EventId = message.EventId,
                Id = Guid.NewGuid().ToString(),
                Tickets = message.Tickets.Select(x => new Tickets()
                {
                    Id = x.TicketId.ToString(),
                    Row = x.Row,
                    Seat = x.Seat,
                }).ToList(),
            };
            var ticketGroupId = ticketGroup.Id.ToString();
            var result = await _ticketGroupRepository.AddAsync(ticketGroup, ticketGroupId);

            //context.Extensions.Set(new ContainerInformation("Inventory", new PartitionKeyPath("/id")));
            //var session = context.SynchronizedStorageSession.CosmosPersistenceSession();

            //var requestOptions = new TransactionalBatchItemRequestOptions
            //{
            //    EnableContentResponseOnWrite = false,
            //};
            //var item = session.Batch.CreateItem(ticketGroup, requestOptions);

            return Guid.Parse(result.Id);
        }


        public async Task<List<Tickets>> GetTicketsByIds(List<Guid> ticketIds, Guid ticketGroupId)
        {
            var ticketGroup = await _ticketGroupRepository.GetByIdAsync(ticketGroupId.ToString(), ticketGroupId.ToString());
            var tickets = ticketGroup.Tickets.Where(t => ticketIds.Any(a => a.ToString() == t.Id)).ToList();
            return tickets;
        }

        public async Task<TicketGroup> GetTicketGroupById(Guid ticketGroupId)
        {
            var ticketGroup = await _ticketGroupRepository.GetByIdAsync(ticketGroupId.ToString(), ticketGroupId.ToString());
            return ticketGroup;
        }
    }
}
