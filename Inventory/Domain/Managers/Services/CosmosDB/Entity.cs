using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;

namespace AcmeTickets.Inventory.Domain.Managers.Services.CosmosDB
{
    public abstract class Entity
    {
        /// <summary>
        /// Default document entity identifier
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Data time to live
        /// </summary>
        // [JsonPropertyNameAttribute("ttl")]
        [JsonProperty(PropertyName = "ttl")]
        public int Ttl { get; set; }

        /// <summary>
        /// Entity
        /// </summary>
        /// <param name="generateId">Generate id</param>
        public Entity(bool generateId = true)
        {
            SetDefaultTimeToLive();

            if (generateId)
            {
                this.Id = Guid.NewGuid().ToString();
            }
        }

        /// <summary>
        /// Set a default data time to live
        /// </summary>
        public virtual void SetDefaultTimeToLive()
        {
            Ttl = -1;
        }
    }
}
