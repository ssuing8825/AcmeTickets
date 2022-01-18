using NServiceBus;
using Microsoft.AspNetCore.Mvc;
using AcmeTickets.EventManagement.Contracts.Messages;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.Inventory.Contracts.Messages;
using AcmeTickets.Inventory.Contracts.Commands;

namespace AcmeTickets.ITOps.SyncApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoldTicketsController : ControllerBase
    {
        private readonly IMessageSession _session;
        public HoldTicketsController(IMessageSession session)
        {
            _session = session;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] HoldTickets message)
        {
            if (!message.IsValid())
            {
                await Task.FromResult(base.BadRequest());
                return BadRequest();
            }

            //// This is fragile like most sync communication. If the communication breaks then the return 
            //// message will fail. This behavior can be changed or you can use those messages for something else
            //// https://docs.particular.net/nservicebus/messaging/callbacks
            var sendOptions = new SendOptions();
            sendOptions.SetDestination("ASBTriggerInventory");
            var responseTask = _session.Request<HoldTicketsResponse>(message, sendOptions);
            var result = await responseTask.ConfigureAwait(false);
            return Ok(result);
        }
    }
}
