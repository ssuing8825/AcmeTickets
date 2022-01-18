using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Events;
using NServiceBus;
using NServiceBus.Logging;

namespace AcmeTickets.EventManagement.Function.Purchase.Handlers;

public class CancelOrderHandler : IHandleMessages<CancelOrder>
{
    static ILog Log = LogManager.GetLogger(typeof(CancelOrderHandler));

    public async Task Handle(CancelOrder message, IMessageHandlerContext context)
    {
        await context.Publish<IOrderCancelled>(x =>
        {
            x.MarketplaceOrderKey = message.MarketplaceOrderKey;
        });


        Log.Info(
            $"Publishing IOrderCancelled TicketGroupId for Order {message.MarketplaceOrderKey}");

    }

}

