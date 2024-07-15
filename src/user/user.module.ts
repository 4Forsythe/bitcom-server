import { Module } from '@nestjs/common'
import { PostModule } from 'src/post/post.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	imports: [PostModule],
	exports: [UserService],
	controllers: [UserController],
	providers: [UserService, PrismaService]
})
export class UserModule {}
