using Acme.Nsb.Commons;
using NServiceBus;
using AcmeTickets.ITOps.Domain;

namespace AcmeTickets.ITOps.SyncApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .UseNServiceBus(ctx =>
                {
                    var configuration = ctx.DefaultAcmeTicketsConfiguration("ASBTriggerITOpsSync", BusRoutes.GetRoutes);
                    configuration.MakeInstanceUniquelyAddressable("1");
                    configuration.EnableCallbacks();
                    return configuration;
                });
    }
}
