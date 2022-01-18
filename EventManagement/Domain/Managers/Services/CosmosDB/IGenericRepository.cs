using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Domain.Managers.Services.CosmosDB
{
    public interface IGenericRepository<TEntity> : IDisposable
      where TEntity : Entity
    {
        string DatabaseId { get; }
        string ContainerId { get; }

        Task<TEntity> AddAsync(TEntity entity, string partitionKey);

        Task DeleteAsync(string id, string partitionKey);

        Task<IEnumerable<TEntity>> GetItemsAsync(string queryString);

        //IAsyncEnumerable<TEntity> GetAllAsync();

        //IAsyncEnumerable<TEntity> GetAllAsync(string partitionKey);

        Task<TEntity> GetByIdAsync(string id, string partitionKey);

        Task UpdateAsync(TEntity entity, string partitionKey);
    }
}
