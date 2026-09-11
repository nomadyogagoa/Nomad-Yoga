import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
export class PaginationDto {
 @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
 @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
 @IsOptional() @Transform(({ value }) => String(value).toLowerCase()) @IsIn(['asc', 'desc']) sortOrder: 'asc' | 'desc' = 'desc';
}
