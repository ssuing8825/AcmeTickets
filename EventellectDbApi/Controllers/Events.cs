using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace EventellectDbApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Events : ControllerBase
    {
        private CosmosClient _client;

        private readonly ILogger<Events> _logger;
        readonly QueryRequestOptions _queryRequestOptions = new QueryRequestOptions() { MaxBufferedItemCount = 100, MaxConcurrency = 10 };

        public Events(ILogger<Events> logger)
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
        public async Task<IEnumerable<Event>> GetAllEvents()
        {
            var events = new List<Event>();

            var streamIterator = _client.GetContainer("Samples.CosmosDB.Simple", "Event").GetItemQueryStreamIterator($"SELECT * FROM Event", requestOptions: _queryRequestOptions);
            while (streamIterator.HasMoreResults)
            {
                using var responseMessage = await streamIterator.ReadNextAsync();
                using var streamReader = new StreamReader(responseMessage.Content);
                using var jsonTextReader = new JsonTextReader(streamReader);
                var jsonSerializer = new JsonSerializer();
                events.AddRange(jsonSerializer.Deserialize<CosmosDocumentRoot<Event>>(jsonTextReader)!.Documents);
            }

            return events;
        }


        //[HttpGet(Name = "GetAllTicketGroups")]
        //public async Task<IEnumerable<TicketGroup>> GetAllTicketGroups()
        //{
        //    var ticketGroups = new List<TicketGroup>();

        //    var streamIterator = _client.GetContainer("Samples.CosmosDB.Simple", "TicketGroup").GetItemQueryStreamIterator($"SELECT * FROM Event", requestOptions: _queryRequestOptions);
        //    while (streamIterator.HasMoreResults)
        //    {
        //        using var responseMessage = await streamIterator.ReadNextAsync();
        //        using var streamReader = new StreamReader(responseMessage.Content);
        //        using var jsonTextReader = new JsonTextReader(streamReader);
        //        var jsonSerializer = new JsonSerializer();
        //        ticketGroups.AddRange(jsonSerializer.Deserialize<CosmosDocumentRoot<TicketGroup>>(jsonTextReader)!.Documents);
        //    }

        //    return ticketGroups;
        //}


    }

    public class CosmosDocumentRoot<T>
    {
        public string _rid { get; set; }
        public T[] Documents { get; set; }
        public int _count { get; set; }
    }

    public class TicketGroup 
    {
        public Guid EventId { get; set; }
        public List<Tickets> Tickets { get; set; }

        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        //public TicketGroup(List<Tickets> tickets)
        //{
        //    Tickets = tickets;
        //}

     }

    public class Tickets
    {
        public Guid id { get; set; }
        public string Row { get; set; }
        public int Seat { get; set; }
    }

    public class Event {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
    }

}