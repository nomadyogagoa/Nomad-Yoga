import { Body, Controller, Get, Patch, Version } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
 constructor(private readonly users: UsersService) {}
 @Get('me') @Version('1') me(@CurrentUser() user: AuthenticatedUser) { return this.users.findMe(user.id); }
 @Patch('me') @Version('1') update(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) { return this.users.updateMe(user.id, dto); }
}
