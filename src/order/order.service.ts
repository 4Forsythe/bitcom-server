import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { CartService } from 'src/cart/cart.service'
import { EmailService } from 'src/email/email.service'

@Injectable()
export class OrderService {
	constructor(
		private userService: UserService,
		private cartService: CartService,
		private emailService: EmailService,
		private prisma: PrismaService
	) {}

	async create(userId: string, dto: CreateOrderDto) {
		const cart = await this.cartService.getAll(userId)

		if (cart.items.length === 0) {
			throw new BadRequestException('В вашей корзине недостаточно товаров')
		}

		cart.items.map(async (item) => {
			await this.prisma.order.create({
				data: {
					customerName: dto.customerPhone,
					customerEmail: dto.customerEmail,
					customerPhone: dto.customerPhone,
					address: dto.address,
					getting: dto.getting,
					payment: dto.payment,
					userId,
					productId: item.productId,
					count: item.count,
					total: item.count * Number(item.product.price)
				}
			})
		})

		const list = cart.items.map(
			(item) => `${item.product.name}: ${item.count} шт.`
		)

		await this.emailService.create({
			to: dto.customerEmail,
			title: `Поступил новый заказ`,
			content: `Получатель: ${dto.customerName}, ${dto.customerPhone}, ${dto.customerEmail}. Заказ: ${list.join(', ')}. Общая стоимость: ${dto.total}. Способ получения: ${dto.getting}. Способ оплаты: ${dto.payment}.`
		})
	}

	// findAll() {
	// 	return `This action returns all order`
	// }

	// findOne(id: number) {
	// 	return `This action returns a #${id} order`
	// }

	// update(id: number, updateOrderDto: UpdateOrderDto) {
	// 	return `This action updates a #${id} order`
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} order`
	// }
}
