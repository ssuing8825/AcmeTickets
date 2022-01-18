using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Messages;
using AcmeTickets.Inventory.Contracts.Commands;
using AcmeTickets.Inventory.Contracts.Messages;
using AcmeTickets.ITOps.Contracts;
using Microsoft.AspNetCore.Mvc;
using NServiceBus;

namespace AcmeTickets.ITOps.SyncApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AllocateAndPurchaseController : ControllerBase
    {
        private readonly IMessageSession _session;
        public AllocateAndPurchaseController(IMessageSession session)
        {
            _session = session;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PurchaseTicketRequest purchaseTicketsRequest)
        {
            if (!purchaseTicketsRequest.IsValid())
            {
                await Task.FromResult(base.BadRequest());
                return BadRequest();
            }

            if (purchaseTicketsRequest.TicketGroupId == Guid.Empty)
            {
                var options = new SendOptions();
                options.SetDestination("ASBTriggerEventManagementPurchase");
                var retrieveTicketGroupIdWithOrderId = new RetrieveTicketGroupIdWithOrderId()
                {
                    MarketplaceId = purchaseTicketsRequest.MarketplaceId,
                    MarketplaceOrderKey = purchaseTicketsRequest.MarketplaceOrderKey,
                    EventellectOrderId = Guid.NewGuid()
                };

                var task = _session.Request<MarketplaceTicketGroupIdResponse>(retrieveTicketGroupIdWithOrderId, options);
                var ticketGroupResponse = await task.ConfigureAwait(false);
                purchaseTicketsRequest.TicketGroupId = ticketGroupResponse.TicketGroupId;
            }

            //// This is fragile like most sync communication. If the communication breaks then the return 
            //// message will fail. This behavior can be changed or you can use those messages for something else
            //// https://docs.particular.net/nservicebus/messaging/callbacks

            // First send the request to allocate the tickets to the order
            var sendOptions = new SendOptions();
            sendOptions.SetDestination("ASBTriggerInventory");
            var allocateTicketRequest = new TicketAllocationRequest()
            {
                MarketplaceOrderKey = purchaseTicketsRequest.MarketplaceOrderKey,
                NumberOfTickets = purchaseTicketsRequest.NumberOfTickets,
                TicketGroupId = purchaseTicketsRequest.TicketGroupId
            };

            var responseTask = _session.Request<TicketAllocationResponse>(allocateTicketRequest, sendOptions);
            var allocationReponse = await responseTask.ConfigureAwait(false);
            //return Ok(allocationReponse);

            ////TODO: Need to agree on the best http codes to return
            // If we couldn't get the tickets then return to the caller
            if (!allocationReponse.IsAllocated)
            {
                return Ok(allocationReponse);
            }

            ////TODO: The system could either return with the successful purchase or just get out

            //Second Send the Purchase request to complete the order 

            sendOptions = new SendOptions();
            sendOptions.SetDestination("ASBTriggerEventManagementPurchase");
            var tickets = new PurchaseAllocatedTickets();
           
            ////TODO: For the purchase tickets there should be more fields than this. 
            tickets.MarketplaceOrderKey = purchaseTicketsRequest.MarketplaceOrderKey;
            tickets.TicketGroupId = purchaseTicketsRequest.TicketGroupId;
            tickets.NumberOfTickets = purchaseTicketsRequest.NumberOfTickets;
            await _session.Send(tickets,sendOptions);

            //// This will return the successful hold message
            return Ok(allocationReponse);


        }
    }
}
