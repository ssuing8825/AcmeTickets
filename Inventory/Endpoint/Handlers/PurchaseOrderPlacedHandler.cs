using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Events;

namespace AcmeTickets.Inventory.Endpoint.Handlers
{
    public class PurchaseOrderPlacedHandler : IHandleMessages<IPurchaseOrderPlaced>
    {
        static ILog Log = LogManager.GetLogger(typeof(PurchaseOrderPlacedHandler));

        public PurchaseOrderPlacedHandler()
        {

        }

        public async Task Handle(IPurchaseOrderPlaced message, IMessageHandlerContext context)
        {
            Log.Info($"IPurchase Order Placed handled");
            
        }
    }
}
