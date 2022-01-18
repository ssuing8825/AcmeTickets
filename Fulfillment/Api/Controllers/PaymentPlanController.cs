using Microsoft.AspNetCore.Mvc;
using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentPlanController : ControllerBase
    {
        private readonly IMessageSession _session;
        public PaymentPlanController(IMessageSession session)
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

        //[HttpPost]
        //public async Task Post([FromBody] SelectPaymentPlan message)
        //{
        //    if (!message.IsValid())
        //    {
        //        await Task.FromResult(base.BadRequest());
        //        return;
        //    }
        //    await _session.Send(message);
        //    await Task.CompletedTask;
        //}
    }
}
