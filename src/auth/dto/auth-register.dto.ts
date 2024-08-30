import {
	IsString,
	IsOptional,
	IsPhoneNumber,
	MaxLength,
	IsEmail,
	MinLength,
	IsNumber
} from 'class-validator'

export class AuthRegisterDto {
	@IsString()
	@IsOptional()
	@MaxLength(48)
	name?: string

	@IsEmail()
	email: string

	@IsString()
	@MinLength(5)
	@MaxLength(32)
	password: string

	@IsNumber()
	code: number
}
