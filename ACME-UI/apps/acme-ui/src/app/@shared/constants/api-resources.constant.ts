import { environment } from '../../../environments/environment';

const createUrl = (actionName: string): string => `${environment.apiHost}/api/${actionName}`;
const createITOpsSyncUrl = (actionName: string): string => `${environment.itOpsSyncApi}/api/${actionName}`;
const createInventoryUrl = (actionName: string): string => `${environment.inventoryFunction}/api/${actionName}`;
const createEventManagementUrl = (actionName: string): string => `${environment.eventManagement}/api/${actionName}`;
const createListUrl = (actionName: string): string => `${environment.listApi}/api/${actionName}`;
const createAuthUrl = (actionName: string): string => `${environment.apiHost}auth/${actionName}`;

// const createAuthUrl = (actionName: string): string =>
//   `${environment.apiHost}auth/${actionName}`;

export const appApiResources = {
  baseUrl: environment.apiHost,
  accessTokenUrl: '',
  login: createAuthUrl('login'),
  register: createAuthUrl('register'),
  user: createUrl(''),
  file: createUrl('file'),
  createEvent: createITOpsSyncUrl('event'),
  createTicketGroup: createInventoryUrl('ticketGroup'),
  holdTickets: createITOpsSyncUrl('HoldTickets'),
  purchaseHeldTickets: createEventManagementUrl('purchaseHeldOrderApi'),
  cancelOrder: createEventManagementUrl('CancelOrderApi'),
  allocateAndPurchase: createITOpsSyncUrl('AllocateAndPurchase'),
  increaseHoldTimeout: createInventoryUrl('IncreaseHoldTimeoutApi'),
  getEvents: createListUrl('Events'),
  getTicketGroups: createListUrl('TicketGroups'),
  logError: '',
};
