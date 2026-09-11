import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail() @MaxLength(320) email!: string;
  @IsString() @MinLength(8) @MaxLength(256) @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'password must contain uppercase, lowercase, and number characters' }) password!: string;
  @IsString() @MinLength(1) @MaxLength(100) firstName!: string;
  @IsString() @MinLength(1) @MaxLength(100) lastName!: string;
}
