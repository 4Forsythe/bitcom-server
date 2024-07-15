import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Module({
	exports: [PostService],
	controllers: [PostController],
	providers: [PostService, UserService, PrismaService]
})
export class PostModule {}
