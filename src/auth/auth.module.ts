import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { getJwtConfig } from 'src/config/jwt.config'
import { JwtStrategy } from './strategies/jwt.strategy'

import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PrismaService } from 'src/prisma.service'
import { EmailModule } from 'src/email/email.module'

@Module({
	exports: [AuthService],
	imports: [
		UserModule,
		EmailModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, PrismaService]
})
export class AuthModule {}
