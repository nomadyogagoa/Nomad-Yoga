import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class ResetPasswordDto {
 @IsString() @MinLength(32) @MaxLength(512) token!: string;
 @IsString() @MinLength(8) @MaxLength(256) @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'newPassword must contain uppercase, lowercase, and number characters' }) newPassword!: string;
}
