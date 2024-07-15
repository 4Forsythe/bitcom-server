import { IsNumber, IsString, IsPhoneNumber } from 'class-validator'

export class AuthLoginDto {
	@IsString()
	@IsPhoneNumber('RU')
	phone: string

	@IsNumber()
	code: number
}
