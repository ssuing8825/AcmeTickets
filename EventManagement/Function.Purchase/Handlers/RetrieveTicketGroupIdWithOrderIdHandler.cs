using NServiceBus.Logging;
using NServiceBus;
using System.Threading.Tasks;
using AcmeTickets.EventManagement.Contracts.Commands;
using AcmeTickets.EventManagement.Contracts.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using AcmeTickets.EventManagement.Contracts.Messages;
using AcmeTickets.ITOps.Contracts.Messages;
using AcmeTickets.Inventory.Contracts.Commands;
using Flurl;
using Flurl.Http;

namespace Function.Purchase.Handlers
{
    public class RetrieveTicketGroupIdWithOrderIdHandler:
        IHandleMessages<RetrieveTicketGroupIdWithOrderId>
    {
        static ILog Log = LogManager.GetLogger(typeof(RetrieveTicketGroupIdWithOrderIdHandler));

        public RetrieveTicketGroupIdWithOrderIdHandler()
        {

        }

        public async Task Handle(RetrieveTicketGroupIdWithOrderId message, IMessageHandlerContext context)
        {
            // TODO: how do I simulate getting valid ticketGroupId from the Marketplace?
            await ReplyWithSuccess(message, context);
        }

        private async Task ReplyWithSuccess(RetrieveTicketGroupIdWithOrderId message, IMessageHandlerContext context)
        {
           
            var objectResponseMessage = new MarketplaceTicketGroupIdResponse
            {
                MarketplaceId = message.MarketplaceId,
                EventellectOrderId = message.EventellectOrderId,
                MarketplaceOrderKey = message.MarketplaceOrderKey,
                TicketGroupId = await GetTicketGroup(message.MarketplaceOrderKey),
                Response = "TicketGroupId Retrieved Successfully"
            };
            await context.Reply(objectResponseMessage);
        }


        public async Task<Guid> GetTicketGroup(Guid orderId)
        {
            try
            {
                //getting a random tickegroup for now, we dont have a mapping created for orderid and ticketgroup.
                var ticketGroupIds = await "https://eventellectdbapi.azurewebsites.net/"
                    .AppendPathSegment("api/TicketGroups").GetJsonListAsync();
                var id = ticketGroupIds.First().id;
                return Guid.Parse(id);
            }
            catch (Exception e)
            {
                Log.Warn($"Error while fetching ticketgroupid from RetrieveTicketGroupIdWithOrderIdHandler {e.Message}");
            }

            return  Guid.NewGuid();


        }
    }
}
