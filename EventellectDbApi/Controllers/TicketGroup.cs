using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace EventellectDbApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketGroups : ControllerBase
    {
        private CosmosClient _client;

        private readonly ILogger<Events> _logger;
        readonly QueryRequestOptions _queryRequestOptions = new QueryRequestOptions() { MaxBufferedItemCount = 100, MaxConcurrency = 10 };


        public TicketGroups(ILogger<Events> logger)
        {
            _logger = logger;

            string databaseName = "Samples.CosmosDB.Simple";
            string containerName = "Event";
            string account = "https://eventellectdb.documents.azure.com:443";
            string key = "Yiuw9cYJPZKPEbumKW2SbE2lf7lS8g966TSWn2kZoswgcbbXxIbJUh2dApZaeWaap2CdcL6NPaeIkMLdpCef0w==";
            var connection = $"AccountEndpoint={account}/;AccountKey={key};";
            _client = new CosmosClient(connection,
                new CosmosClientOptions
                {
                    SerializerOptions = new CosmosSerializationOptions
                    {
                        Indented = true
                    }
                });
        }



        [HttpGet]
        public async Task<IEnumerable<TicketGroup>> GetAllTicketGroups()
        {
            var ticketGroups = new List<TicketGroup>();

            var streamIterator = _client.GetContainer("Samples.CosmosDB.Simple", "Inventory").GetItemQueryStreamIterator($"SELECT * FROM Event", requestOptions: _queryRequestOptions);
            while (streamIterator.HasMoreResults)
            {
                using var responseMessage = await streamIterator.ReadNextAsync();
                using var streamReader = new StreamReader(responseMessage.Content);
                using var jsonTextReader = new JsonTextReader(streamReader);
                var jsonSerializer = new JsonSerializer();
                ticketGroups.AddRange(jsonSerializer.Deserialize<CosmosDocumentRoot<TicketGroup>>(jsonTextReader)!.Documents);
            }

            return ticketGroups;
        }

    }
}
