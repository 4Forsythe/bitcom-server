import {
	IsString,
	IsOptional,
	MaxLength,
	IsEmail,
	IsPhoneNumber
} from 'class-validator'

export class CreateUserDto {
	@IsString()
	@IsOptional()
	@MaxLength(20)
	name?: string

	@IsString()
	@IsOptional()
	@IsEmail()
	email?: string

	@IsString()
	@IsPhoneNumber()
	phone: string
}
