using Acme.Nsb.Commons;
using AcmeTickets.Inventory.Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using NServiceBus;

namespace AcmeTickets.FraudProtection.Api
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
                    var configuration = ctx.DefaultAcmeConfiguration(typeof(Program).Namespace, BusRoutes.GetRoutes);
                    configuration.SendOnly();
                    return configuration;
                });
    }
}
