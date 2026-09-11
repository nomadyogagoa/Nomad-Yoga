import { Body, Controller, Get, Param, Patch, Post, Query, Req, Version } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { RoleName } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ContactService } from './contact.service';

class Enquiry { @IsString() @Length(1, 160) name!: string; @IsEmail() email!: string; @IsOptional() @IsString() @Length(1, 40) phone?: string; @IsString() @Length(1, 200) subject!: string; @IsString() @Length(1, 10000) message!: string; @IsOptional() @IsString() interestType?: string; @IsOptional() @IsString() interestReference?: string; }
class UpdateEnquiryStatus { @IsIn(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']) status!: string; }

@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}
  @Public() @Post() @Version('1') @Throttle({ default: { limit: 5, ttl: 60_000 } }) submit(@Body() dto: Enquiry, @Req() request: any) { return this.service.submit(dto, request.user?.id); }
}

@Controller('admin/contact-enquiries') @Roles(RoleName.ADMIN)
export class ContactAdminController {
  constructor(private readonly service: ContactService) {}
  @Get() @Version('1') list(@Query() query: any) { return this.service.list(query); }
  @Get(':id') @Version('1') get(@Param('id') id: string) { return this.service.get(id); }
  @Patch(':id') @Version('1') update(@Param('id') id: string, @Body() dto: UpdateEnquiryStatus) { return this.service.update(id, dto.status); }
}
