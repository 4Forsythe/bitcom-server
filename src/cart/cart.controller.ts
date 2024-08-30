import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { Auth } from 'src/auth/auth.decorator'
import { User } from 'src/user/user.decorator'

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post()
	@Auth()
	create(@User('id') userId: string, @Body() dto: CreateCartDto) {
		return this.cartService.create(userId, dto)
	}

	@Get('me')
	@Auth()
	getAll(@User('id') userId: string) {
		return this.cartService.getAll(userId)
	}

	@Get('me/count')
	@Auth()
	getCount(@User('id') userId: string) {
		return this.cartService.getCount(userId)
	}

	@Patch(':id')
	@Auth()
	update(
		@Param('id') id: string,
		@User('id') userId: string,
		@Body() dto: UpdateCartDto
	) {
		return this.cartService.update(id, userId, dto)
	}

	@Delete(':id')
	@Auth()
	remove(@Param('id') id: string, @User('id') userId: string) {
		return this.cartService.remove(id, userId)
	}

	@Delete()
	@Auth()
	reset(@User('id') userId: string) {
		return this.cartService.reset(userId)
	}
}
