import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsObject, IsOptional, IsString, IsUrl, Length, Max, Min, ValidateNested } from 'class-validator';
import { OrderStatus, ProductStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class CatalogQueryDto extends PaginationDto { @IsOptional() @IsString() category?: string; @IsOptional() @IsString() search?: string; @IsOptional() @IsString() sortBy?: 'name'|'createdAt'|'updatedAt'; }
export class CartItemDto { @IsString() @Length(1,100) variantId!: string; @Type(()=>Number) @IsInt() @Min(1) @Max(999) quantity!: number; }
export class UpdateCartItemDto { @Type(()=>Number) @IsInt() @Min(1) @Max(999) quantity!: number; }
export class AddressDto { @IsString() @Length(1,100) firstName!:string; @IsString() @Length(1,100) lastName!:string; @IsString() @Length(1,200) line1!:string; @IsOptional() @IsString() @Length(1,200) line2?:string; @IsString() @Length(1,100) city!:string; @IsOptional() @IsString() @Length(1,100) state?:string; @IsString() @Length(1,30) postalCode!:string; @IsString() @Length(2,100) country!:string; @IsOptional() @IsString() @Length(1,40) phone?:string; }
export class CheckoutDto { @ValidateNested() @Type(()=>AddressDto) shippingAddress!:AddressDto; @IsOptional() @ValidateNested() @Type(()=>AddressDto) billingAddress?:AddressDto; }
export class OrderQueryDto extends PaginationDto { @IsOptional() @IsEnum(OrderStatus) status?:OrderStatus; }
export class CategoryDto { @IsString() @Length(1,120) name!:string; @IsString() @Length(1,140) slug!:string; @IsOptional() @IsString() @Length(1,100) parentId?:string; }
export class UpdateCategoryDto { @IsOptional() @IsString() @Length(1,120) name?:string; @IsOptional() @IsString() @Length(1,140) slug?:string; @IsOptional() @IsString() @Length(1,100) parentId?:string|null; }
export class ProductDto { @IsString() @Length(1,160) name!:string; @IsString() @Length(1,180) slug!:string; @IsOptional() @IsString() description?:string; @IsOptional() @IsString() @Length(1,100) categoryId?:string|null; @IsOptional() @IsEnum(ProductStatus) status?:ProductStatus; }
export class VariantDto { @IsString() @Length(1,160) name!:string; @IsString() @Length(1,100) sku!:string; @IsString() price!:string; @IsOptional() @IsString() @Length(3,3) currency?:string; @IsOptional() @IsObject() attributes?:Record<string,unknown>; }
export class UpdateVariantDto { @IsOptional() @IsString() @Length(1,160) name?:string; @IsOptional() @IsString() @Length(1,100) sku?:string; @IsOptional() @IsString() price?:string; @IsOptional() @IsString() @Length(3,3) currency?:string; @IsOptional() @IsObject() attributes?:Record<string,unknown>; }
export class InventoryAdjustmentDto { @Type(()=>Number) @IsInt() delta!:number; @IsString() @Length(1,300) reason!:string; }
export class ImageDto { @IsUrl() @Length(1,2000) url!:string; @IsOptional() @IsString() @Length(1,250) altText?:string; @IsOptional() @Type(()=>Number) @IsInt() @Min(0) sortOrder?:number; }
export class UpdateImageDto { @IsOptional() @IsUrl() @Length(1,2000) url?:string; @IsOptional() @IsString() @Length(1,250) altText?:string; @IsOptional() @Type(()=>Number) @IsInt() @Min(0) sortOrder?:number; }
export class UpdateOrderStatusDto { @IsEnum(OrderStatus) status!:OrderStatus; }
export class AdminOrderQueryDto extends OrderQueryDto { @IsOptional() @IsString() search?:string; @IsOptional() @IsString() from?:string; @IsOptional() @IsString() to?:string; }
