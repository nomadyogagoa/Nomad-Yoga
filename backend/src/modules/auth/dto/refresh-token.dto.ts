import { IsOptional, IsString, MaxLength } from 'class-validator';
export class RefreshTokenDto { @IsOptional() @IsString() @MaxLength(1024) refreshToken?: string; }
