import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../../common/pagination/pagination.dto';
export class NotificationQueryDto extends PaginationDto { @IsOptional() @IsString() @MaxLength(100) type?: string; }
