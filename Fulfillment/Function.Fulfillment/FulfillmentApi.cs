using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NServiceBus;

namespace Function.Fulfillment
{
    public class FulfillmentApi
    {
        readonly IFunctionEndpoint functionEndpoint;

        public FulfillmentApi(IFunctionEndpoint functionEndpoint)
        {
            this.functionEndpoint = functionEndpoint;
        }

        [FunctionName("Fulfillment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest request, ExecutionContext executionContext, ILogger logger)
        {
            var sendOptions = new SendOptions();
            sendOptions.RouteToThisEndpoint();

            string requestBody = await new StreamReader(request.Body).ReadToEndAsync();
            //var addTickets = JsonConvert.DeserializeObject<AddTicketGroupToInventory>(requestBody);

            //logger.LogInformation($"Marketplaceid = {addTickets.EventId}");

            //await functionEndpoint.Send(addTickets, sendOptions, executionContext, logger);

            return new OkObjectResult($" sent.");
        }
    }
}
