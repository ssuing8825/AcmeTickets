using AcmeTickets.FraudProtection.Contracts.Events;
using AcmeTickets.FraudProtection.Endpoint.Sagas.Data;
using AcmeTickets.FraudProtection.Internal.Contracts.Events;
using AcmeTickets.FraudProtection.Internal.Contracts.Messages;
using Acme.PaymentAuthorization.Contracts.Commands;
using Acme.PaymentAuthorization.Contracts.Events;
using NServiceBus;
using NServiceBus.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcmeTickets.FraudProtection.Endpoint.Sagas
{
    public class PaymentPlanLifecycleSaga : Saga<PaymentPlanLifecycleSagaData>
        , IAmStartedByMessages<ISelectedAPaymentPlan>
        , IHandleMessages<IPaymentAuthorized>
        , IHandleMessages<IPaymentDeclined>
        , IHandleTimeouts<PaymentDue>
    {
        static readonly ILog Log = LogManager.GetLogger(typeof(PaymentPlanLifecycleSaga));
        public PaymentPlanLifecycleSaga()
        {

        }

        //NOTE: You would never handle an event raised by the same endpoint that raised it in reality.
        //Outside of a prototype, this saga would exist inside its' own lifecycle endpoint, away from 
        //the handler that raised this event in the first place (but within the same BC)
        public async Task Handle(ISelectedAPaymentPlan message, IMessageHandlerContext context)
        {
            this.Data.PolicyId = message.ApplicationId;

            //TODO: start the saga by looking up the payment plan, and setting a timeout for the next payment due date
            
            await Task.CompletedTask;
        }

        public async Task Handle(IPaymentDeclined message, IMessageHandlerContext context)
        {
            //TODO:
            await context.Publish<IPaymentMissed>(x =>
            {

            });
        }

        public async Task Handle(IPaymentAuthorized message, IMessageHandlerContext context)
        {
            //TODO:
            await context.Publish<IPaymentMade>(x =>
            {
                x.PolicyId = message.PolicyId;
            });
        }

        public async Task Timeout(PaymentDue state, IMessageHandlerContext context)
        {
            //TODO:
            await context.Send<ProcessPayment>(x =>
            {
                
            });
        }

        protected override void ConfigureHowToFindSaga(SagaPropertyMapper<PaymentPlanLifecycleSagaData> mapper)
        {
            mapper.ConfigureMapping<ISelectedAPaymentPlan>(x => x.ApplicationId).ToSaga(s => s.PolicyId);
            mapper.ConfigureMapping<IPaymentAuthorized>(x => x.PolicyId).ToSaga(s => s.PolicyId);
            mapper.ConfigureMapping<IPaymentDeclined>(x => x.PolicyId).ToSaga(s => s.PolicyId);
        
        }
    }
}
