using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.Inventory.Contracts.Commands;
using AcmeTickets.Inventory.Contracts.Events;
using AcmeTickets.Inventory.Domain.Managers;

namespace AcmeTickets.EventManagement.Function.Purchase.Handlers
{
    public class AddTicketGroupToInventoryHandler : IHandleMessages<AddTicketGroupToInventory>
    {
        static ILog Log = LogManager.GetLogger(typeof(AddTicketGroupToInventoryHandler));
        private readonly IInventoryManager _inventoryManager;


        public AddTicketGroupToInventoryHandler(IInventoryManager inventoryManager)
        {
            _inventoryManager = inventoryManager;
        }

        public async Task Handle(AddTicketGroupToInventory message, IMessageHandlerContext context)
        {
            Log.Info($"Handling AddTicketGroupToInventory");

            //// Save the ticket group to the database to get the GroupId
            //// Also every ticket should get an ID for easier use and sharing.
            //// Publish the event to start the saga and get the tickets on the marketplace

            var ticketGroupId = await _inventoryManager.AddTicketGroupToInventoryAsync(message);
            var ticketGroup = await _inventoryManager.GetTicketGroupById(ticketGroupId);

            // At this point we have a valid purchase order with all the data necessary so let's move forward. 
            await context.Publish<IEventTicketGroupCreated>(x =>
            {
                x.TicketGroupId = ticketGroupId;
                x.Tickets = message.Tickets; ////Slightly concerned about reference issues. 
                x.EventId = message.EventId;
            });


            // await context.Publish<ITicketsPurchased>(x =>
            // {
            //     x.TicketGroupId = ticketGroupId;
            //     x.MarketplaceOrderKey = Guid.NewGuid();
            //     x.AllocatedTickets = new List<Guid>();
            //     x.EventellectOrderId = Guid.NewGuid();
            // });
        }
    }
}
