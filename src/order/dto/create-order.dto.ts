import {
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	IsOptional,
	IsPhoneNumber,
	IsNumber
} from 'class-validator'

enum GettingType {
	PICKUP = 'Самовывоз'
}

enum PaymentType {
	CASH = 'При получении'
}

export class CreateOrderDto {
	@IsString()
	@MaxLength(144)
	customerName: string

	@IsPhoneNumber('RU', { message: 'Только российские номера телефонов' })
	customerPhone: string

	@IsEmail()
	customerEmail: string

	@IsString()
	@IsOptional()
	address?: string

	@IsString()
	getting: GettingType

	@IsString()
	payment: PaymentType

	@IsString()
	@IsOptional()
	userId?: string

	@IsNumber()
	count: number

	@IsNumber()
	total: number
}
