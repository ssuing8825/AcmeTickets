using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using NServiceBus;

namespace  Function.Inventory
{

    public class IncreaseHoldTimeoutApi
    {
        readonly IFunctionEndpoint functionEndpoint;

        public IncreaseHoldTimeoutApi(IFunctionEndpoint functionEndpoint)
        {
            this.functionEndpoint = functionEndpoint;
        }

        [FunctionName("IncreaseHoldTimeoutApi")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            IncreaseHoldTimeout increaseHoldTimeout, ExecutionContext executionContext, ILogger logger)
        {


            logger.LogInformation("C# HTTP trigger IncreaseHoldTimeoutApi function received a request.");

            var sendOptions = new SendOptions();
            sendOptions.RouteToThisEndpoint();


            await functionEndpoint.Send(increaseHoldTimeout, sendOptions, executionContext, logger);
            logger.LogInformation($"increaseHoldTimeout {increaseHoldTimeout.TicketGroupId}");

            return new OkObjectResult($"{nameof(IncreaseHoldTimeout)} sent. {increaseHoldTimeout.TicketGroupId}");
        }
    }
}