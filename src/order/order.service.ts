import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { Request } from 'express'

import {
	CreateOrderDto,
	OrderPaymentMethod,
	OrderStatus
} from './dto/create-order.dto'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { CartService } from 'src/cart/cart.service'
import { PaymentService } from 'src/payment/payment.service'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderParamsDto } from './dto/order-params.dto'

@Injectable()
export class OrderService {
	constructor(
		private userService: UserService,
		private cartService: CartService,
		@Inject(forwardRef(() => PaymentService))
		private paymentService: PaymentService,
		private prisma: PrismaService
	) {}

	async create(req: Request, userId: string, dto: CreateOrderDto) {
		const cart = await this.cartService.getAll(req, userId)

		if (cart.items.length === 0) {
			throw new BadRequestException('В вашей корзине недостаточно товаров')
		}

		const items = cart.items.map((item) => ({
			count: item.count,
			price: Number(item.product.price),
			productId: item.productId
		}))

		const total = items.reduce((sum, item) => sum + item.price * item.count, 0)

		const {
			customerName,
			customerEmail,
			customerPhone,
			address,
			comment,
			paymentId,
			gettingMethod,
			paymentMethod
		} = dto

		const order = await this.prisma.order.create({
			data: {
				total,
				customerName,
				customerEmail,
				customerPhone,
				address,
				comment,
				token: userId,
				paymentId,
				status: OrderStatus.PENDING,
				gettingMethod,
				paymentMethod,
				userId
			}
		})

		await this.prisma.orderItem.createMany({
			data: items.map((item) => ({
				count: item.count,
				productId: item.productId,
				orderId: order.id
			}))
		})

		if (dto.paymentMethod === OrderPaymentMethod.CASH) {
			return this.update(order.id, {
				status: OrderStatus.CREATED
			})
		}

		if (dto.paymentMethod === OrderPaymentMethod.CARD) {
			const paymentItems = cart.items.map((item) => ({
				amount: { value: Number(item.product.price), currency: 'RUB' },
				description: item.product.name,
				quantity: item.count,
				vat_code: 4
			}))

			return this.paymentService.create({
				amount: { value: total, currency: 'RUB' },
				description: `Оплата заказа №-${order.id}`,
				customer: {
					name: customerName,
					email: customerEmail,
					phone: customerPhone
				},
				items: paymentItems,
				order: order.id,
				returnUrl: 'http://localhost:3000/my/order-list'
			})
		}
	}

	async getAll(userId: string, params?: OrderParamsDto) {
		const { take, skip } = params

		console.log(params)

		const orders = await this.prisma.order.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			include: { items: { include: { product: true } } },
			take: +take || 10,
			skip: +skip || 0
		})

		if (!orders) {
			return { items: [], count: 0 }
		}

		return { items: orders, count: orders.length }
	}

	async update(id: string, dto: UpdateOrderDto) {
		const order = await this.prisma.order.findUnique({
			where: { id }
		})

		if (!order) {
			throw new NotFoundException('Заказ не найден')
		}

		return this.prisma.order.update({
			where: { id },
			data: {
				customerName: dto?.customerName,
				customerEmail: dto?.customerEmail,
				customerPhone: dto?.customerPhone,
				address: dto?.address,
				comment: dto?.comment,
				paymentId: dto?.paymentId,
				status: dto?.status,
				gettingMethod: dto?.gettingMethod,
				paymentMethod: dto?.paymentMethod
			}
		})
	}

	async getTotal() {
		return this.prisma.order.count()
	}

	async remove(id: string) {
		const order = await this.prisma.order.findUnique({
			where: { id }
		})

		if (!order) {
			throw new NotFoundException('Заказ не найден')
		}

		return this.prisma.order.delete({
			where: { id }
		})
	}
}
