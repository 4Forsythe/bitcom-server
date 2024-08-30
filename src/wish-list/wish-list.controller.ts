import { Controller, Get, Post, Param, Delete } from '@nestjs/common'
import { WishListService } from './wish-list.service'
import { Auth } from 'src/auth/auth.decorator'
import { User } from 'src/user/user.decorator'

@Controller('wish-list')
export class WishListController {
	constructor(private readonly wishlistService: WishListService) {}

	@Post(':id')
	@Auth()
	toggle(@Param('id') id: string, @User('id') userId: string) {
		return this.wishlistService.toggle(id, userId)
	}

	@Get('me')
	@Auth()
	getAll(@User('id') userId: string) {
		return this.wishlistService.getAll(userId)
	}

	@Get('me/count')
	@Auth()
	getCount(@User('id') userId: string) {
		return this.wishlistService.getCount(userId)
	}

	@Delete()
	@Auth()
	reset(@User('id') userId: string) {
		return this.wishlistService.reset(userId)
	}
}
