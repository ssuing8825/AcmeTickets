using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Messages;
using Microsoft.AspNetCore.Mvc;
using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acme.AccountsReceivable.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseTicketsController : ControllerBase
    {
        private readonly IMessageSession _session;
        public PurchaseTicketsController(IMessageSession session)
        {
            _session = session;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PurchaseAllocatedTickets message)
        {
            if (!message.IsValid())
            {
                await Task.FromResult(base.BadRequest());
                return BadRequest();
            }
           
            //// This is fragile like most sync communication. If the communcation breaks then the return 
            //// message will fail. This behavior can be changed or you can use those messages for something else
            //// https://docs.particular.net/nservicebus/messaging/callbacks
            var sendOptions = new SendOptions();
            sendOptions.SetDestination("ASBTriggerEventManagementPurchase");
            var responseTask = _session.Request<PurchaseTicketsResponse>(message, sendOptions);
            var result =  await responseTask.ConfigureAwait(false);
            return Ok(result);
        }
    }
}
