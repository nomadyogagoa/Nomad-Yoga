import { ArrayMinSize, ArrayUnique, IsArray, IsIn } from 'class-validator';
import { RoleName } from '@prisma/client';
export class UpdateUserRolesDto { @IsArray() @ArrayMinSize(1) @ArrayUnique() @IsIn([RoleName.USER, RoleName.ADMIN], { each: true }) roles!: RoleName[]; }
