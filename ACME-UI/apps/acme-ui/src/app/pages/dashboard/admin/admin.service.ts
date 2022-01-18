import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { appApiResources } from '@shared/constants';

import { IAddEventRequest } from './addEventRequest.interface';
import { IAllocateAndPurchase } from './allocate-and-purchase-request.interface';
import { ICancelOrder } from './cancel-order.interface';
import { IEvent } from './event.interface';
import { IHoldOrderRequest } from './hold-order.interface';
import { IIncreaseHoldTimeout } from './increase-hold-timeout.interface';
import { IPurchaseHeldOrder } from './purchase-held-order.interface';
import { ITicketGroup } from './ticketGroup.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private _http: HttpClient) {}

  addEvent$(event: IAddEventRequest) {
    event.eventId = uuidv4();
    event.eventDate = new Date(event.eventDate).toISOString();
    return this._http.post(appApiResources.createEvent, event, { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      }),
      tap((res) => {
        console.log('response', res);
      })
    );
  }

  getAllEvents$() {
    return this._http.get<IEvent[]>(appApiResources.getEvents).pipe(
      map((response) => {
        return response;
      }),
      tap((res) => {
        console.log('Events', res);
      })
    );
  }

  getAllTicketGroupsByEventId$(eventId: string) {
    return this._http.get<ITicketGroup[]>(appApiResources.getTicketGroups).pipe(
      map((response) => {
        return response.filter((ticketGroup) => ticketGroup.eventId === eventId);
      }),
      tap((res) => {
        console.log('Ticket Groups', res);
      })
    );
  }

  allocateAndPurchase$(request: IAllocateAndPurchase) {
    //todo
    return this._http.post(appApiResources.allocateAndPurchase, request, { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      }),
      tap((res) => {
        console.log('response', res);
      })
    );
  }

  holdTickets$(request: IHoldOrderRequest) {
    //todo
    return this._http.post(appApiResources.holdTickets, request, { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      }),
      tap((res) => {
        console.log('response', res);
      })
    );
  }

  cancelOrder$(request: ICancelOrder) {
    //todo
    return this._http.post(appApiResources.cancelOrder, request, { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      }),
      tap((res) => {
        console.log('response', res);
      })
    );
  }

  purchaseHeldOrder$(request: IPurchaseHeldOrder) {
    //todo
    return this._http.post(appApiResources.purchaseHeldTickets, request, { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      }),
      tap((res) => {
        console.log('response', res);
      })
    );
  }

  increaseHoldTimeout$(request: IIncreaseHoldTimeout) {
    //todo
    return this._http.post(appApiResources.increaseHoldTimeout, request, { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      }),
      tap((res) => {
        console.log('response', res);
      })
    );
  }
}
