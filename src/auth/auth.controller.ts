import {
	Controller,
	Req,
	Res,
	Post,
	Body,
	UnauthorizedException,
	Param
} from '@nestjs/common'

import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(
		@Body() dto: AuthLoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.login(dto)
		this.authService.createRefreshToken(res, refreshToken)

		return response
	}

	@Post('login/extend')
	async getTokens(
		@Req() req: Request,
		@Res({ passthrough: true })
		res: Response
	) {
		const refreshTokenFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshToken(res)
			throw new UnauthorizedException('Refresh token is not passed')
		}

		const { refreshToken, ...response } = await this.authService.getTokens(
			refreshTokenFromCookies
		)

		this.authService.createRefreshToken(res, refreshToken)

		return response
	}

	@Post('register')
	async register(@Body() dto: AuthRegisterDto) {
		const response = await this.authService.register(dto)

		return response
	}

	@Post('send-code')
	async generateCode(@Body() dto: AuthRegisterDto) {
		await this.authService.sendCode(dto.phone)

		return true
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshToken(res)

		return true
	}
}
