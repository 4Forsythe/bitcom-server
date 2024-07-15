import { IsNumber, IsString } from 'class-validator'

export class CreateCartDto {
	@IsString()
	productId: string

	@IsNumber()
	count: number
}
