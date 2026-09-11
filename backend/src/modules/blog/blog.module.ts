import { Module } from '@nestjs/common';
import { BlogAdminController, BlogController } from './blog.controller'; import { BlogService } from './blog.service';

@Module({controllers:[BlogController,BlogAdminController],providers:[BlogService]})
export class BlogModule {}
