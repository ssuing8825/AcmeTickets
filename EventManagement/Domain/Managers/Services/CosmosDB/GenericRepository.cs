using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB
{
    public abstract class GenericRepository<TEntity> : IGenericRepository<TEntity>, IDisposable
         where TEntity : Entity
    {
        private readonly CosmosClient _cosmosClient;
        private readonly Container _container;

        public abstract string DatabaseId { get; }
        public abstract string ContainerId { get; }

        public GenericRepository(CosmosClient cosmosClient)
        {
            _cosmosClient = cosmosClient;
            _container = _cosmosClient.GetContainer(DatabaseId, ContainerId);

        }

        public async Task<TEntity> AddAsync(TEntity entity, string partitionKey)
        {
            try
            {
                var itemResponse = await _container.CreateItemAsync<TEntity>(entity, new PartitionKey(partitionKey));
                return itemResponse.Resource;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task DeleteAsync(string id, string partitionKey)
        {
            await _container.DeleteItemAsync<TEntity>(id, new PartitionKey(partitionKey));
        }

        public async Task<IEnumerable<TEntity>> GetItemsAsync(string queryString)
        {
            var query = this._container.GetItemQueryIterator<TEntity>(new QueryDefinition(queryString));
            List<TEntity> results = new();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.Resource);
            }
            return results;
        }

        public async Task<TEntity> GetByIdAsync(string id, string partitionKey)
        {
            var itemResponse = await _container.ReadItemAsync<TEntity>(id, new PartitionKey(partitionKey));

            if (itemResponse != null && itemResponse.Resource != null)
                return itemResponse.Resource;

            return null;
        }

        public async Task UpdateAsync(TEntity entity, string partitionKey)
        {
            await _container.ReplaceItemAsync<TEntity>(entity, entity.Id, new PartitionKey(partitionKey));
        }

        public void Dispose()
        {
            _cosmosClient?.Dispose();
        }

        //public async IAsyncEnumerable<TEntity> GetAllAsync()
        //{
        //    await foreach (var item in _container.GetItemQueryIterator<TEntity>(new QueryDefinition("SELECT * FROM c")))
        //    {
        //        yield return item;
        //    }
        //}

        //public async IAsyncEnumerable<TEntity> GetAllAsync(string partitionKey)
        //{
        //    await foreach (var item in _container.GetItemQueryIterator<TEntity>(new QueryDefinition("SELECT * FROM c"), null,
        //        new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey) }))
        //    {
        //        yield return item;
        //    }
        //}
    }
}
