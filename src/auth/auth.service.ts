import {
	Injectable,
	NotFoundException,
	BadRequestException,
	UnauthorizedException
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { Response } from 'express'
import { addMinutes } from 'date-fns'

import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma.service'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService,
		private prisma: PrismaService
	) {}

	REFRESH_TOKEN_NAME = 'refreshToken'
	EXPIRE_DAY_REFRESH_TOKEN = 30

	async login(dto: AuthLoginDto) {
		const user = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: AuthRegisterDto) {
		const phone = await this.userService.getByPhone(dto.phone)

		if (phone)
			throw new BadRequestException(
				'Пользователь с указанным номером телефона уже существует'
			)

		const data = await this.userService.create(dto)

		await this.generateCode(data.id)

		return data
	}

	async sendCode(phone: string) {
		const user = await this.userService.getByPhone(phone)

		if (!user) throw new NotFoundException('Пользователь не найден')

		await this.generateCode(user.id)
	}

	private async verifyUser(userId: string, code: number) {
		const response = await this.prisma.code.findFirst({
			where: {
				code,
				userId,
				expiresAt: {
					gt: new Date()
				}
			}
		})

		if (!response)
			throw new BadRequestException('Введен неверный код активации')

		await this.prisma.code.delete({
			where: { id: response.id }
		})

		return this.prisma.user.update({
			where: { id: userId },
			data: { isActive: true }
		})
	}

	private async generateCode(userId: string) {
		const code = Math.floor(100000 + Math.random() * 900000)

		await this.prisma.code.upsert({
			where: { userId },
			create: {
				code,
				userId,
				expiresAt: addMinutes(new Date(), 10)
			},
			update: {
				code,
				expiresAt: addMinutes(new Date(), 10)
			}
		})
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '30d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthLoginDto) {
		const user = await this.userService.getByPhone(dto.phone)

		if (!user) throw new NotFoundException('Пользователь не найден')

		const isValid = await this.verifyUser(user.id, dto.code)

		if (!isValid)
			throw new UnauthorizedException('Введен неверный номер телефона')

		return user
	}

	async getTokens(refreshToken: string) {
		const userToken = await this.jwt.verifyAsync(refreshToken)

		if (!userToken)
			throw new UnauthorizedException('Введен неверный токен обновления')

		const user = await this.userService.getOne(userToken.id)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	createRefreshToken(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			secure: true,
			domain: this.configService.get('SITE_DOMAIN'),
			expires: expiresIn,
			sameSite: 'lax'
		})
	}

	removeRefreshToken(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			secure: true,
			domain: this.configService.get('SITE_DOMAIN'),
			expires: new Date(0),
			sameSite: 'lax'
		})
	}
}
