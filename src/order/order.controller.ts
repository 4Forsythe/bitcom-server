import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'

import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Auth } from 'src/auth/auth.decorator'
import { User } from 'src/user/user.decorator'

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	@Auth()
	create(@User('id') userId: string, @Body() dto: CreateOrderDto) {
		console.log(dto)
		return this.orderService.create(userId, dto)
	}

	// @Get()
	// findAll() {
	// 	return this.orderService.findAll()
	// }

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	// 	return this.orderService.findOne(+id)
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
	// 	return this.orderService.update(+id, updateOrderDto)
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.orderService.remove(+id)
	// }
}
