import { IsString } from 'class-validator'

export class CreateWishListDto {
	@IsString()
	productId: string
}
