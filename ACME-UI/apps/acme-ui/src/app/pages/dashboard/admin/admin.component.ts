import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { IAddEventRequest } from './addEventRequest.interface';
import { AdminService } from './admin.service';
import { IAllocateAndPurchase } from './allocate-and-purchase-request.interface';
import { ICancelOrder } from './cancel-order.interface';
import { IEvent } from './event.interface';
import { IHoldOrderRequest } from './hold-order.interface';
import { IIncreaseHoldTimeout } from './increase-hold-timeout.interface';
import { IPurchaseHeldOrder } from './purchase-held-order.interface';
import { ITicketGroup } from './ticketGroup.interface';

@Component({
  selector: 'fm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public addEventFailed = false;
  public allocateAndPurchaseEventFailed = false;
  public errorMessage = '';
  public addRequestApiResponseMessage = '';
  public holdOrderApiResponseMessage = '';
  public allocateAndPurchaseApiResponseMessage = '';
  public cancelOrderApiResponseMessage = '';
  public purchaseHeldOrderApiResponseMessage = '';
  public increaseHoldTimeoutApiResponseMessage = '';
  public loader!: boolean;
  public orderLoader!: boolean;
  public allEvents: IEvent[] = [];
  public ticketGroups: ITicketGroup[] = [];
  public eventForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    date: new FormControl('', [Validators.required]),
  });

  public orderForm = new FormGroup({
    action: new FormControl('', [Validators.required]),
    events: new FormControl('', [Validators.required]),
    ticketGroups: new FormControl('', [Validators.required]),
    marketplaceId: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    marketplaceOrderKey: new FormControl('', [Validators.required]),
    eventellectOrderId: new FormControl('', [Validators.required]),
    allocatedTickets: new FormControl('', []),
    needsAdditionalMarketplaceDataForFutureProcessing: new FormControl('', [Validators.required]),
    numberOfSeats: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });

  constructor(private _adminService: AdminService, private _cdr: ChangeDetectorRef) {
    console.log('TODO');
    this.getAllEvents();
  }

  public get name() {
    return this.eventForm.get('name');
  }

  public get date() {
    return this.eventForm.get('date');
  }

  public get actionCtrl() {
    return this.orderForm.get('action');
  }

  public get eventsCtrl() {
    return this.orderForm.get('events');
  }

  public get ticketGroupsCtrl() {
    return this.orderForm.get('ticketGroups');
  }

  public get marketplaceIdCtrl() {
    return this.orderForm.get('marketplaceId');
  }

  public get marketplaceOrderKeyCtrl() {
    return this.orderForm.get('marketplaceOrderKey');
  }

  public get eventellectOrderIdCtrl() {
    return this.orderForm.get('eventellectOrderId');
  }

  public get allocatedTicketsCtrl() {
    return this.orderForm.get('allocatedTickets');
  }

  public get needsAdditionalMarketplaceDataForFutureProcessingCtrl() {
    return this.orderForm.get('needsAdditionalMarketplaceDataForFutureProcessing');
  }

  public get numberOfSeatsCtrl() {
    return this.orderForm.get('numberOfSeats');
  }

  ngOnInit(): void {
    console.log('TODO');
  }

  dateChanged(event: MatDatepickerInputEvent<Date>) {
    if (this.date) {
      this.date?.setValue(event.value);
    }
  }

  onAddEvent() {
    const event: IAddEventRequest = {
      eventDate: this.date?.value,
      eventName: this.name?.value,
      eventId: '',
    };
    this.loader = true;
    this._adminService.addEvent$(event).subscribe(
      (response) => {
        this.addRequestApiResponseMessage = response.toString();
        this.loader = false;
        this.getAllEvents();
        this._cdr.detectChanges();
      },
      (error) => {
        this.addRequestApiResponseMessage = 'error: ' + error.toString();
        this.loader = false;
        this._cdr.detectChanges();
      }
    );
  }

  onEventChanged() {
    // TODO;
    // this._cdr.detectChanges();
    this.getTicketGroupsByEventId();
  }

  getAllEvents() {
    this.orderLoader = true;
    this._adminService.getAllEvents$().subscribe(
      (events) => {
        console.log('events', events);
        this.allEvents = events;
        this.orderLoader = false;
        this._cdr.detectChanges();
      },
      (error) => {
        this.orderLoader = false;
        console.log(error);
      }
    );
  }

  getTicketGroupsByEventId() {
    const event = this.eventsCtrl?.value as IEvent;
    this.orderLoader = true;
    if (event && event.id) {
      this._adminService.getAllTicketGroupsByEventId$(event.id).subscribe(
        (ticketGroups) => {
          this.ticketGroups = ticketGroups.filter((ticketGroup) => ticketGroup.eventId === event.id);
          this.orderLoader = false;
          this._cdr.detectChanges();
        },
        (error) => {
          this.orderLoader = false;
          console.log(error);
        }
      );
    }
  }

  purchaseOrder() {
    const actionName: string = this.actionCtrl?.value;
    switch (actionName) {
      case 'holdOrder':
        this.holdTickets();
        break;
      case 'allocateAndPurchase':
        this.placeAllocateAndPurchaseOrder();
        break;
      case 'cancelOrder':
        this.cancelOrder();
        break;
      case 'purchaseHeldOrder':
        this.purchaseHeldOrder();
        break;
      case 'increaseHoldTimeout':
        this.increaseHoldTimeout();
        break;

      default:
        break;
    }
  }

  trackByEventId(index: number, event: IEvent) {
    return event.id;
  }

  trackByTicketGroupId(index: number, event: ITicketGroup) {
    return event.id;
  }

  placeAllocateAndPurchaseOrder() {
    const marketplaceId: number = this.marketplaceIdCtrl?.value;
    const ticketGroup: ITicketGroup = this.ticketGroupsCtrl?.value;
    const numberOfTickets: number = this.numberOfSeatsCtrl?.value;
    const marketplaceOrderKey: string = this.marketplaceOrderKeyCtrl?.value;
    const needsAdditionalMarketplaceDataForFutureProcessing: boolean = this.needsAdditionalMarketplaceDataForFutureProcessingCtrl?.value;
    if (
      marketplaceId &&
      ticketGroup &&
      ticketGroup.id &&
      numberOfTickets &&
      marketplaceOrderKey &&
      needsAdditionalMarketplaceDataForFutureProcessing !== null &&
      needsAdditionalMarketplaceDataForFutureProcessing !== undefined
    ) {
      this.orderLoader = true;
      const request: IAllocateAndPurchase = {
        marketplaceId,
        ticketGroupId: ticketGroup.id,
        numberOfTickets,
        marketplaceOrderKey,
        needsAdditionalMarketplaceDataForFutureProcessing,
      };

      this._adminService.allocateAndPurchase$(request).subscribe(
        (response) => {
          this.orderLoader = false;
          console.log(response);
          this.allocateAndPurchaseApiResponseMessage = response;
          this._cdr.detectChanges();
        },
        (error) => {
          this.orderLoader = false;
          console.log(error);
          this._cdr.detectChanges();
        }
      );
    }
  }

  holdTickets() {
    const marketplaceId: number = this.marketplaceIdCtrl?.value;
    const ticketGroup: ITicketGroup = this.ticketGroupsCtrl?.value;
    const numberOfTickets: number = this.numberOfSeatsCtrl?.value;
    const marketplaceOrderKey: string = this.marketplaceOrderKeyCtrl?.value;
    const eventellectOrderId: string = this.eventellectOrderIdCtrl?.value;
    if (marketplaceId && ticketGroup && ticketGroup.id && numberOfTickets && marketplaceOrderKey && eventellectOrderId) {
      this.orderLoader = true;
      const request: IHoldOrderRequest = {
        marketplaceId,
        ticketGroupId: ticketGroup.id,
        numberOfTickets,
        marketplaceOrderKey,
        eventellectOrderId,
      };

      this._adminService.holdTickets$(request).subscribe(
        (response) => {
          this.orderLoader = false;
          console.log(response);
          this.holdOrderApiResponseMessage = response;
          this._cdr.detectChanges();
        },
        (error) => {
          this.orderLoader = false;
          console.log(error);
          this._cdr.detectChanges();
        }
      );
    }
  }

  cancelOrder() {
    const marketplaceId: number = this.marketplaceIdCtrl?.value;
    const ticketGroup: ITicketGroup = this.ticketGroupsCtrl?.value;
    const allocatedTicketsStr = this.allocatedTicketsCtrl?.value;
    let allocatedTickets: string[] = [];
    if (allocatedTickets) {
      allocatedTickets = allocatedTicketsStr.split(',');
    }
    const marketplaceOrderKey: string = this.marketplaceOrderKeyCtrl?.value;
    const eventellectOrderId: string = this.eventellectOrderIdCtrl?.value;
    if (
      marketplaceId &&
      ticketGroup &&
      ticketGroup.id &&
      allocatedTickets &&
      allocatedTickets.length > 0 &&
      marketplaceOrderKey &&
      eventellectOrderId
    ) {
      this.orderLoader = true;
      const request: ICancelOrder = {
        marketplaceId,
        ticketGroupId: ticketGroup.id,
        allocatedTickets,
        marketplaceOrderKey,
        eventellectOrderId,
      };

      this._adminService.cancelOrder$(request).subscribe(
        (response) => {
          this.orderLoader = false;
          console.log(response);
          this.cancelOrderApiResponseMessage = response;
          this._cdr.detectChanges();
        },
        (error) => {
          this.orderLoader = false;
          console.log(error);
          this._cdr.detectChanges();
        }
      );
    }
  }

  purchaseHeldOrder() {
    const marketplaceId: number = this.marketplaceIdCtrl?.value;
    const ticketGroup: ITicketGroup = this.ticketGroupsCtrl?.value;
    const allocatedTicketsStr = this.allocatedTicketsCtrl?.value;
    let allocatedTickets: string[] = [];
    if (allocatedTickets) {
      allocatedTickets = allocatedTicketsStr.split(',');
    }
    const marketplaceOrderKey: string = this.marketplaceOrderKeyCtrl?.value;
    const eventellectOrderId: string = this.eventellectOrderIdCtrl?.value;
    if (
      marketplaceId &&
      ticketGroup &&
      ticketGroup.id &&
      allocatedTickets &&
      allocatedTickets.length > 0 &&
      marketplaceOrderKey &&
      eventellectOrderId
    ) {
      this.orderLoader = true;
      const request: IPurchaseHeldOrder = {
        marketplaceId,
        ticketGroupId: ticketGroup.id,
        allocatedTickets,
        marketplaceOrderKey,
        eventellectOrderId,
      };

      this._adminService.purchaseHeldOrder$(request).subscribe(
        (response) => {
          this.orderLoader = false;
          console.log(response);
          this.purchaseHeldOrderApiResponseMessage = response;
          this._cdr.detectChanges();
        },
        (error) => {
          this.orderLoader = false;
          console.log(error);
          this._cdr.detectChanges();
        }
      );
    }
  }

  increaseHoldTimeout() {
    const marketplaceId: number = this.marketplaceIdCtrl?.value;
    const ticketGroup: ITicketGroup = this.ticketGroupsCtrl?.value;
    const allocatedTicketsStr = this.allocatedTicketsCtrl?.value;
    let allocatedTickets: string[] = [];
    if (allocatedTickets) {
      allocatedTickets = allocatedTicketsStr.split(',');
    }
    const marketplaceOrderKey: string = this.marketplaceOrderKeyCtrl?.value;
    const eventellectOrderId: string = this.eventellectOrderIdCtrl?.value;
    if (
      marketplaceId &&
      ticketGroup &&
      ticketGroup.id &&
      allocatedTickets &&
      allocatedTickets.length > 0 &&
      marketplaceOrderKey &&
      eventellectOrderId
    ) {
      this.orderLoader = true;
      const request: IIncreaseHoldTimeout = {
        marketplaceId,
        ticketGroupId: ticketGroup.id,
        allocatedTickets,
        marketplaceOrderKey,
        eventellectOrderId,
      };

      this._adminService.increaseHoldTimeout$(request).subscribe(
        (response) => {
          this.orderLoader = false;
          console.log(response);
          this.increaseHoldTimeoutApiResponseMessage = response;
          this._cdr.detectChanges();
        },
        (error) => {
          this.orderLoader = false;
          console.log(error);
          this._cdr.detectChanges();
        }
      );
    }
  }

  onActionChanged() {
    const actionName: string = this.actionCtrl?.value;
    switch (actionName) {
      case 'holdOrder':
        this.needsAdditionalMarketplaceDataForFutureProcessingCtrl?.disable();
        this.allocatedTicketsCtrl?.disable();
        this.eventellectOrderIdCtrl?.enable();
        break;
      case 'allocateAndPurchase':
        this.allocatedTicketsCtrl?.disable();
        this.needsAdditionalMarketplaceDataForFutureProcessingCtrl?.enable();
        this.eventellectOrderIdCtrl?.disable();
        break;
      case 'cancelOrder':
        this.allocatedTicketsCtrl?.enable();
        this.needsAdditionalMarketplaceDataForFutureProcessingCtrl?.disable();
        this.eventellectOrderIdCtrl?.enable();
        break;
      case 'purchaseHeldOrder':
        this.allocatedTicketsCtrl?.enable();
        this.needsAdditionalMarketplaceDataForFutureProcessingCtrl?.disable();
        this.eventellectOrderIdCtrl?.enable();
        break;
      case 'increaseHoldTimeout':
        this.allocatedTicketsCtrl?.enable();
        this.needsAdditionalMarketplaceDataForFutureProcessingCtrl?.disable();
        this.eventellectOrderIdCtrl?.enable();
        break;

      default:
        break;
    }
    this._cdr.detectChanges();
  }
}
