using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Events;

namespace AcmeTickets.EventManagement.Endpoint.Handlers
{
    public class PurchaseTicketsHandler : IHandleMessages<PurchaseTickets>
    {
        static ILog Log = LogManager.GetLogger(typeof(PurchaseTicketsHandler));

        public PurchaseTicketsHandler()
        {

        }

        public async Task Handle(PurchaseTickets message, IMessageHandlerContext context)
        {
            Log.Info($"Handling purchase ticket command");
            await context.Publish<IPurchaseOrderPlaced>(x =>
            {
                x.TicketGroupId = message.TicketGroupId;
                x.NumberOfTickets = message.NumberOfTickets;
            });
            await Task.CompletedTask;
        }
    }
}
