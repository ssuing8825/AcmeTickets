using AcmeTickets.EventManagement.Contracts.Commands;
using Microsoft.AspNetCore.Mvc;
using NServiceBus;
using System.Threading.Tasks;

namespace AcmeTickets.EventManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketPurchaseController : ControllerBase
    {
        private readonly IMessageSession _session;
        public TicketPurchaseController(IMessageSession session)
        {
            _session = session;
        }

        //[HttpGet]
        //public async Task<IList<PaymentPlan>> Get(Guid applicationId)
        //{
        //    return await Task.FromResult(new List<PaymentPlan>
        //    {
        //        new PaymentPlan{ ApplicationId = applicationId, PaymentPlanId = Guid.NewGuid(), Description = "Payment Plan 1",},
        //        new PaymentPlan{ ApplicationId = applicationId, PaymentPlanId = Guid.NewGuid(), Description = "Payment Plan 2",}
        //    });
        //}

        [HttpPost]
        public async Task Post([FromBody] PurchaseTickets message)
        {
            if (!message.IsValid())
            {
                await Task.FromResult(base.BadRequest());
                return;
            }
            await _session.Send(message);
            await Task.CompletedTask;
        }
    }
}
