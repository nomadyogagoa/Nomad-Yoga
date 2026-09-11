import { BadRequestException } from '@nestjs/common';
import { OrderStatus, Prisma, ProductStatus } from '@prisma/client';
import { StoreService } from './store.service';

describe('StoreService', () => {
  const prisma:any={productVariant:{findUnique:jest.fn()},cart:{findFirst:jest.fn(),create:jest.fn(),findUniqueOrThrow:jest.fn()},cartItem:{findUnique:jest.fn(),upsert:jest.fn()},product:{findMany:jest.fn(),count:jest.fn()},$transaction:jest.fn((fn:any)=>fn(prisma))};
  const email={sendNonBlocking:jest.fn()}; const service=new StoreService(prisma,{record:jest.fn()} as any,{} as any,email as any);
  beforeEach(()=>jest.clearAllMocks());
  it('only queries ACTIVE products for the public catalog',async()=>{prisma.product.findMany.mockResolvedValue([]);prisma.product.count.mockResolvedValue(0);await service.products({page:1,limit:20,sortOrder:'desc'} as any);expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({status:ProductStatus.ACTIVE})}));});
  it('rejects a guest cart without a safe session identifier',()=>expect(()=> (service as any).identity(undefined,'bad')).toThrow(BadRequestException));
  it('calculates cart totals from current variant prices',()=>{const out=(service as any).cartResponse({id:'c',currency:'INR',items:[{id:'i',quantity:2,productVariant:{id:'v',name:'Small',sku:'SKU',price:new Prisma.Decimal('19.95'),currency:'INR',product:{id:'p',name:'Mat',slug:'mat'},inventory:{quantityOnHand:3,quantityReserved:0}}}]});expect(out.subtotal.equals(new Prisma.Decimal('39.90'))).toBe(true);expect(out.itemCount).toBe(2);});
  it('rejects cart quantities beyond available stock',()=>expect(()=> (service as any).stock({inventory:{quantityOnHand:2,quantityReserved:0}},3)).toThrow(BadRequestException));
  it('allows only the central order state transitions',()=>{expect((service as any).allowed(OrderStatus.PENDING,OrderStatus.CONFIRMED)).toBe(true);expect((service as any).allowed(OrderStatus.CANCELLED,OrderStatus.SHIPPED)).toBe(false);expect((service as any).allowed(OrderStatus.DELIVERED,OrderStatus.RETURNED)).toBe(true);});
  it('sends shipped email after the committed admin transition',async()=>{prisma.order={findUnique:jest.fn().mockResolvedValue({id:'o',status:OrderStatus.PROCESSING,items:[]}),update:jest.fn().mockResolvedValue({id:'o',orderNumber:'ORD-1',email:'persisted@example.com',status:OrderStatus.SHIPPED})};await service.adminOrderStatus('a','o',OrderStatus.SHIPPED);expect(email.sendNonBlocking).toHaveBeenCalledWith('order-shipped','persisted@example.com',{orderNumber:'ORD-1'},{entityId:'o'});});
  it('does not send for an unchanged order status',async()=>{prisma.order={findUnique:jest.fn().mockResolvedValue({id:'o',status:OrderStatus.SHIPPED,items:[]})};await service.adminOrderStatus('a','o',OrderStatus.SHIPPED);expect(email.sendNonBlocking).not.toHaveBeenCalled();});
});
