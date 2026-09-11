import { PaymentStatus } from '@prisma/client';
export type GatewayCreateInput={paymentId:string,reference:string,amountMinor:number,currency:string,successUrl?:string,cancelUrl?:string};
export type GatewayResult={gatewayReference:string,checkoutUrl?:string,status:PaymentStatus,metadata?:Record<string,unknown>};
export type GatewayWebhook={eventId:string,paymentReference:string,status:PaymentStatus,transactionId?:string,amountMinor?:number,metadata?:Record<string,unknown>};
export interface PaymentGateway { readonly name:string; createPayment(input:GatewayCreateInput):Promise<GatewayResult>; fetchPaymentStatus(reference:string):Promise<GatewayResult>; refundPayment(reference:string,amountMinor:number):Promise<any>; verifyWebhook(raw:Buffer,headers:Record<string,string|undefined>):GatewayWebhook; }
