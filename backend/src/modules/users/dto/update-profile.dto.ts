import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
export class UpdateProfileDto {
 @IsOptional() @IsString() @MaxLength(100) firstName?: string;
 @IsOptional() @IsString() @MaxLength(100) lastName?: string;
 @IsOptional() @IsString() @MaxLength(30) phone?: string;
 @IsOptional() @IsString() @MaxLength(10) countryCode?: string;
 @IsOptional() @IsString() @MaxLength(100) city?: string;
 @IsOptional() @IsDateString() dateOfBirth?: string;
 @IsOptional() @IsUrl() @MaxLength(2048) avatarUrl?: string;
 @IsOptional() @IsString() @MaxLength(2000) bio?: string;
}
