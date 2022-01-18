using AcmeTickets.Inventory.Domain.Managers.Services.CosmosDB;

namespace AcmeTickets.Inventory.Domain.Managers.Entities
{
    public class Tickets : Entity
    {
        public Tickets() : base(true)
        {
        }

        public string Row { get; set; }
        public int Seat { get; set; }
    }
}
