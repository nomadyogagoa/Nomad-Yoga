import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { RoleName, UserStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/pagination/pagination.dto';
export class AdminUsersQueryDto extends PaginationDto {
 @IsOptional() @IsString() @MaxLength(200) search?: string;
 @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
 @IsOptional() @IsIn([RoleName.USER, RoleName.ADMIN]) role?: RoleName;
 @IsOptional() @IsIn(['createdAt', 'email', 'lastLoginAt', 'status']) sortBy: 'createdAt' | 'email' | 'lastLoginAt' | 'status' = 'createdAt';
}
