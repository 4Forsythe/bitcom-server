import { IsString, IsOptional, IsPhoneNumber, MaxLength } from 'class-validator'

export class AuthRegisterDto {
	@IsString()
	@IsPhoneNumber('RU')
	phone: string

	@IsString()
	@IsOptional()
	@MaxLength(20)
	name?: string
}
