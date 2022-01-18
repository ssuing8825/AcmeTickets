using Acme.Nsb.Commons;
using AcmeTickets.Inventory.Domain;
using AcmeTickets.Inventory.Domain.Managers;
using AcmeTickets.Inventory.Domain.Managers.Services.CosmosDB;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using NServiceBus;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(Startup))]
[assembly: NServiceBusTriggerFunction(Startup.EndpointName)]


public class Startup : FunctionsStartup
{
    public const string EndpointName = "ASBTriggerInventory";

    public override void Configure(IFunctionsHostBuilder builder)
    {
        FunctionsHostBuilderContext context = builder.GetContext();
        var services = builder.Services;

        services.AddApplicationInsightsTelemetry();

        builder.UseNServiceBus(() =>
        {
            var configuration = NServiceBusConfigurationExtensions.DefaultAcmeTicketsConfiguration(EndpointName, BusRoutes.GetRoutes, context);
            return configuration;
        });

        services.AddTransient<IInventoryManager, InventoryManager>();
        services.AddSingleton<ITicketGroupRepository>(InitializeCosmosClientInstanceAsync(context).GetAwaiter().GetResult());
    }

    /// <summary>
    /// Creates a Cosmos DB database and a container with the specified partition key. 
    /// </summary>
    /// <returns>Task<TicketGroupRepository></returns>
    private static async Task<TicketGroupRepository> InitializeCosmosClientInstanceAsync(FunctionsHostBuilderContext context)
    {
        var config = context.Configuration;
        string databaseName = config.GetSection("DatabaseName").Value;
        string containerName = "Event";
        //string account = "https://eventellectdb.documents.azure.com:443";
        //string key = "Yiuw9cYJPZKPEbumKW2SbE2lf7lS8g966TSWn2kZoswgcbbXxIbJUh2dApZaeWaap2CdcL6NPaeIkMLdpCef0w==";
        var connection = config.GetSection("DbConnectionString").Value;
        var client = new CosmosClient(connection,
                new CosmosClientOptions
                {
                    SerializerOptions = new CosmosSerializationOptions
                    {
                        Indented = true
                    }
                });
        var database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
        await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");
        var ticketGroupRepository = new TicketGroupRepository(client);
        return ticketGroupRepository;
    }
}

