using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using NServiceBus;
using AcmeTickets.EventManagement.Contracts.Commands;

namespace AcmeTickets.EventManagement.Function.Purchase 
{
    public class CancelOrderApi
    {
        readonly IFunctionEndpoint functionEndpoint;

        public CancelOrderApi(IFunctionEndpoint functionEndpoint)
        {
            this.functionEndpoint = functionEndpoint;
        }

        [FunctionName("CancelOrderApi")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] CancelOrder cancelOrder, ExecutionContext executionContext, ILogger logger)
        {
            logger.LogInformation("C# HTTP trigger function received a request for CancelOrder.");

            var sendOptions = new SendOptions();
            sendOptions.SetDestination("ASBTriggerEventManagementPurchase"); 
             //sendOptions.RouteToThisEndpoint();

             await functionEndpoint.Send(cancelOrder, sendOptions, executionContext, logger);
            logger.LogInformation($"CancelOrder {cancelOrder.MarketplaceOrderKey}");

            return new OkObjectResult($"{nameof(CancelOrder)} sent. {cancelOrder.MarketplaceOrderKey}");
        }
    }
}
