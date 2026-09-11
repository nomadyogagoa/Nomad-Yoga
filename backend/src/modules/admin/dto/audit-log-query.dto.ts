import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../../common/pagination/pagination.dto';
export class AuditLogQueryDto extends PaginationDto { @IsOptional() @IsString() @MaxLength(100) actorUserId?: string; @IsOptional() @IsString() @MaxLength(100) entityType?: string; @IsOptional() @IsString() @MaxLength(100) entityId?: string; @IsOptional() @IsString() @MaxLength(100) action?: string; @IsOptional() @IsDateString() from?: string; @IsOptional() @IsDateString() to?: string; }
