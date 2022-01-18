export interface IAllocateAndPurchase {
  marketplaceId: number;
  ticketGroupId: string;
  numberOfTickets: number;
  marketplaceOrderKey: string;
  needsAdditionalMarketplaceDataForFutureProcessing: boolean;
}
