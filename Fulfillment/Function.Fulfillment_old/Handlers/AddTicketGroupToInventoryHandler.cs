using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.Fulfillment.Contracts.Commands;
using AcmeTickets.Fulfillment.Contracts.Events;

namespace AcmeTickets.EventManagement.Function.Purchase.Handlers
{
    public class AddTicketGroupToInventoryHandler : IHandleMessages<AddTicketGroupToInventory>
    {
        static ILog Log = LogManager.GetLogger(typeof(AddTicketGroupToInventoryHandler));

        public async Task Handle(AddTicketGroupToInventory message, IMessageHandlerContext context)
        {
            Log.Info($"Handling AddTicketGroupToInventory");

            //// Save the ticket group to the database to get the GroupId
            //// Also every ticket should get an ID for easier use and sharing.
            //// Publish the event to start the saga and get the tickets on the marketplace


            // At this point we have a valid purchase order with all the data necessary so let's move forward. 
            await context.Publish<IEventTicketGroupCreated>(x =>
            {
                x.TicketGroupId = null;
                x.Tickets = message.Tickets; ////Slightly concerned about reference issues. 
            });
        }
    }
}
