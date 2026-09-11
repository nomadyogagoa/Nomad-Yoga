import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PaymentPurpose, PaymentStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/pagination/pagination.dto';
export class CreatePaymentDto { @IsEnum(PaymentPurpose) purpose!: PaymentPurpose; @IsString() @Length(1, 100) relatedEntityId!: string; }
export class PaymentQueryDto extends PaginationDto { @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus; @IsOptional() @IsEnum(PaymentPurpose) purpose?: PaymentPurpose; }
export class AdminPaymentQueryDto extends PaymentQueryDto { @IsOptional() @IsString() gateway?: string; @IsOptional() @IsString() relatedEntityId?: string; @IsOptional() @IsString() search?: string; @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) from?: string; @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) to?: string; }
export class RefundDto { @IsOptional() @Matches(/^\d+(\.\d{1,2})?$/) amount?: string; @IsOptional() @IsString() @Length(1, 500) reason?: string; }
