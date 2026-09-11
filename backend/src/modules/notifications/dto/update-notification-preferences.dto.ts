import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
export class UpdateNotificationPreferencesDto {
 @IsOptional() @IsBoolean() emailEnabled?: boolean; @IsOptional() @IsBoolean() smsEnabled?: boolean; @IsOptional() @IsBoolean() whatsappEnabled?: boolean; @IsOptional() @IsBoolean() pushEnabled?: boolean;
 @IsOptional() @IsBoolean() classRemindersEnabled?: boolean; @IsOptional() @IsBoolean() bookingUpdatesEnabled?: boolean; @IsOptional() @IsBoolean() scheduleChangesEnabled?: boolean; @IsOptional() @IsBoolean() membershipRemindersEnabled?: boolean;
 @IsOptional() @IsInt() @Min(0) @Max(10080) reminderLeadMinutes?: number;
}
