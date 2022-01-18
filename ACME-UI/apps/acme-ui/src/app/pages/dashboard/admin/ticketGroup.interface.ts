import { ITicket } from './ticket.interface';

export interface ITicketGroup {
  eventId: string;
  tickets: ITicket[];
  id: string;
}
