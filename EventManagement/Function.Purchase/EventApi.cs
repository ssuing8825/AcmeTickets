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
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;
using System.Net;

namespace AcmeTickets.EventManagement.Function.Purchase
{
    public class EventApi
    {
        readonly IFunctionEndpoint functionEndpoint;

        public EventApi(IFunctionEndpoint functionEndpoint)
        {
            this.functionEndpoint = functionEndpoint;
        }

        [FunctionName("EventApi")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] AddEvent addEvent, ExecutionContext executionContext, ILogger logger)
        {
            logger.LogInformation("C# HTTP trigger EventApi function received a request.");

            var sendOptions = new SendOptions();
            sendOptions.SetDestination("ASBTriggerEventManagementPurchase");

            await functionEndpoint.Send(addEvent, sendOptions, executionContext, logger);
            logger.LogInformation($"Add event {addEvent.EventId}");

            return new OkObjectResult($"{nameof(AddEvent)} sent. {addEvent.EventId}");
        }
    }
}
