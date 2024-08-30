import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { AuthService } from 'src/auth/auth.service'
import { AuthModule } from 'src/auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	exports: [EmailService],
	controllers: [EmailController],
	providers: [EmailService]
})
export class EmailModule {}
