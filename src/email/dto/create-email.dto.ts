import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateEmailDto {
	@IsEmail()
	to: string

	@IsString()
	@MinLength(4)
	@MaxLength(64)
	title: string

	@IsString()
	@MinLength(12)
	@MaxLength(7200)
	content: string
}
