import {
	IsNumber,
	IsString,
	IsPhoneNumber,
	MinLength,
	MaxLength,
	IsOptional,
	IsEmail
} from 'class-validator'

export class AuthLoginDto {
	@IsEmail()
	email: string

	@IsNumber()
	@IsOptional()
	code?: number

	@IsString()
	@IsOptional()
	@MinLength(5)
	@MaxLength(32)
	password?: string
}
