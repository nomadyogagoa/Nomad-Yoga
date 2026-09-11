import { Body, Controller, Get, Param, Patch, Post, Query, Version } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { RoleName } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { NewsletterService } from './newsletter.service';

class Subscribe { @IsEmail() email!: string; @IsOptional() @IsString() @Length(1, 100) firstName?: string; }
class Campaign { @IsString() @Length(1, 200) subject!: string; @IsString() @Length(1, 20000) content!: string; @IsOptional() @IsString() status?: string; }

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}
  @Public() @Post('subscribe') @Version('1') @Throttle({ default: { limit: 5, ttl: 60_000 } }) subscribe(@Body() dto: Subscribe) { return this.service.subscribe(dto.email, dto.firstName); }
  @Public() @Post('unsubscribe') @Version('1') @Throttle({ default: { limit: 5, ttl: 60_000 } }) unsubscribe(@Body() dto: Subscribe) { return this.service.unsubscribe(dto.email); }
}

@Controller('admin/newsletter') @Roles(RoleName.ADMIN)
export class NewsletterAdminController {
  constructor(private readonly service: NewsletterService) {}
  @Get('subscribers') @Version('1') subscribers(@Query() query: any) { return this.service.subscribers(query); }
  @Get('campaigns') @Version('1') campaigns(@Query() query: any) { return this.service.campaigns(query); }
  @Post('campaigns') @Version('1') create(@Body() dto: Campaign) { return this.service.createCampaign(dto); }
  @Get('campaigns/:id') @Version('1') get(@Param('id') id: string) { return this.service.campaign(id); }
  @Patch('campaigns/:id') @Version('1') update(@Param('id') id: string, @Body() dto: Campaign) { return this.service.updateCampaign(id, dto); }
  @Post('campaigns/:id/prepare') @Version('1') prepare(@Param('id') id: string) { return this.service.prepare(id); }
  @Post('campaigns/:id/send') @Version('1') send(@Param('id') id: string) { return this.service.sendCampaign(id); }
}
