using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Events;

namespace AcmeTickets.Inventory.Function.Purchase.Handlers
{
    /// <summary>
    /// THIS CLASS SHOULD BE RENOVED!!!
    /// </summary>
    public class PurchaseOrderPlacedHandler
    {
        static ILog Log = LogManager.GetLogger(typeof(PurchaseOrderPlacedHandler));

        public PurchaseOrderPlacedHandler()
        {
        }

        //public async Task Handle(IPurchaseOrderPlaced message, IMessageHandlerContext context)
        //{
        //    Log.Info($"REMOVE IPurchase Order Placed handled in inventory");
            
        //}
    }
}
