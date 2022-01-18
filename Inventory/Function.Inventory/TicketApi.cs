using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using NServiceBus;
using System.IO;
using Newtonsoft.Json;
using AcmeTickets.Inventory.Contracts.Commands;

namespace Function.Inventory
{
    public class TicketApi
    {
        readonly IFunctionEndpoint functionEndpoint;

        public TicketApi(IFunctionEndpoint functionEndpoint)
        {
            this.functionEndpoint = functionEndpoint;
        }

        [FunctionName("TicketGroup")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest request, ExecutionContext executionContext, ILogger logger)
        {

            var sendOptions = new SendOptions();
            sendOptions.RouteToThisEndpoint();

            string requestBody = await new StreamReader(request.Body).ReadToEndAsync();
            var addTickets = JsonConvert.DeserializeObject<AddTicketGroupToInventory>(requestBody);

            logger.LogInformation($"Marketplaceid = {addTickets.EventId}");

            await functionEndpoint.Send(addTickets, sendOptions, executionContext, logger);

            return new OkObjectResult($"{nameof(AddTicketGroupToInventory)} sent.");
        }
    }
}
