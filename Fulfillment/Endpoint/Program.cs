using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using NServiceBus;
using Microsoft.Extensions.Logging;
using Acme.Nsb.Commons;
using AcmeTickets.Fulfillment.Domain;

namespace AcmeTickets.Fulfillment.Endpoint
{
    static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .UseConsoleLifetime()
                .ConfigureLogging(logging =>
                {
                    logging.AddConsole();
                })
                .UseNServiceBus(ctx =>
                {
                    return ctx.DefaultAcmeConfiguration(typeof(Program).Namespace, BusRoutes.GetRoutes);
                });
        }


    }
}