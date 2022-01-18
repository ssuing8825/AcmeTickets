using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using NServiceBus;
using AcmeTickets.EventManagement.Contracts.Commands;
using System.IO;
using Newtonsoft.Json;

namespace AcmeTickets.EventManagement.Function.Purchase
{
    public class PurchaseHeldOrderApi
    {
        readonly IFunctionEndpoint functionEndpoint;

        public PurchaseHeldOrderApi(IFunctionEndpoint functionEndpoint)
        {
            this.functionEndpoint = functionEndpoint;
        }

        [FunctionName("PurchaseHeldOrderApi")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] PurchaseHeldTickets purchaseHeldTickets, ExecutionContext executionContext, ILogger logger)
        {
            

            logger.LogInformation("C# HTTP trigger PurchaseHeldOrderApi function received a request.");

            var sendOptions = new SendOptions();
            sendOptions.SetDestination("ASBTriggerEventManagementPurchase");


            await functionEndpoint.Send(purchaseHeldTickets, sendOptions, executionContext, logger);
            logger.LogInformation($"purchaseHeldTickets {purchaseHeldTickets.TicketGroupId}");

            return new OkObjectResult($"{nameof(PurchaseHeldTickets)} sent. {purchaseHeldTickets.TicketGroupId}");
        }
    }
}
