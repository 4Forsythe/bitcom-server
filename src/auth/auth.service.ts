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
import { verify } from 'argon2'
import { EmailService } from 'src/email/email.service'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private emailService: EmailService,
		private configService: ConfigService,
		private prisma: PrismaService
	) {}

	REFRESH_TOKEN_NAME = 'refreshToken'
	EXPIRE_DAY_REFRESH_TOKEN = 30
	SEND_CODE_COOLDOWN = 0.3

	async login(dto: AuthLoginDto) {
		const { password, ...user } = await this.validateUser(dto)

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: AuthRegisterDto) {
		await this.verify(dto.email, dto.code)

		const user = await this.userService.create(dto)

		await this.prisma.user.update({
			where: { email: user.email },
			data: { isActive: true }
		})

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async sendCode(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email }
		})

		if (user)
			throw new BadRequestException('Такой пользователь уже зарегистрирован')

		const cooldown = await this.checkCooldown(email)

		if (cooldown > 0)
			throw new BadRequestException(`Повторите попытку через ${cooldown} сек.`)

		const code = await this.generateCode(email)

		await this.emailService.create({
			to: email,
			title: 'Код подтверждения',
			content: `Ваш код подтверждения bitcom63.ru — ${code}.`
		})
	}

	private generateCooldown(attempt: number) {
		const timing = this.SEND_CODE_COOLDOWN

		const periods = [timing, timing * 1, timing * 1, timing * 1]

		return periods[Math.min(attempt, periods.length - 1)]
	}

	async checkCooldown(email: string) {
		const code = await this.prisma.userCode.findUnique({
			where: { email }
		})

		if (code) {
			const now = new Date()

			if (code.lastAttemptAt) {
				const period = this.generateCooldown(code.attempt)
				const cooldown = addMinutes(code.lastAttemptAt, period)

				if (now < cooldown) {
					return Math.floor((cooldown.getTime() - now.getTime()) / 1000)
				}
			}
		}

		return 0
	}

	async verify(email: string, code: number) {
		const user = await this.prisma.user.findUnique({ where: { email } })

		if (user)
			throw new BadRequestException('Такой пользователь уже зарегистрирован')

		const response = await this.prisma.userCode.findFirst({
			where: {
				code,
				email,
				expiresAt: {
					gt: new Date()
				}
			}
		})

		if (!response)
			throw new BadRequestException('Введен неверный код активации')

		await this.prisma.userCode.delete({
			where: { id: response.id }
		})

		return true
	}

	async generateCode(email: string) {
		const code = Math.floor(100000 + Math.random() * 900000)

		await this.prisma.userCode.upsert({
			where: { email },
			create: {
				code,
				email,
				attempt: 1,
				lastAttemptAt: new Date(),
				expiresAt: addMinutes(new Date(), 10)
			},
			update: {
				code,
				attempt: {
					increment: 1
				},
				lastAttemptAt: new Date(),
				expiresAt: addMinutes(new Date(), 10)
			}
		})

		return code
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '14d'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '30d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthLoginDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		if (!user.isActive && !dto.code) {
			throw new BadRequestException('Учетная запись нуждается в активации')
		}

		if (dto.code) {
			const isValid = await this.verify(user.email, dto.code)

			if (!isValid)
				throw new UnauthorizedException('Введен неверный код активации')

			return user
		}

		if (user.isActive && dto.password) {
			if (!user.password) {
				throw new UnauthorizedException('Введен неверный пароль')
			}

			const isValid = await verify(user.password, dto.password)

			if (!isValid) throw new UnauthorizedException('Введен неверный пароль')

			return user
		}
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
			secure: false /* true - только для https */,
			domain: this.configService.get('SITE_DOMAIN'),
			expires: expiresIn,
			sameSite: 'lax'
		})
	}

	removeRefreshToken(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			secure: false,
			domain: this.configService.get('SITE_DOMAIN'),
			expires: new Date(0),
			sameSite: 'lax'
		})
	}
}
