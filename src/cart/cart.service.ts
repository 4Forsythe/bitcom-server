import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'

@Injectable()
export class CartService {
	constructor(
		private productService: ProductService,
		private prisma: PrismaService
	) {}

	async create(userId: string, dto: CreateCartDto) {
		await this.productService.getOne(dto.productId)

		const item = await this.prisma.cart.findFirst({
			where: { userId, productId: dto.productId }
		})

		if (item) {
			return this.prisma.cart.update({
				where: { id: item.id },
				data: { count: item.count + dto.count }
			})
		}

		return this.prisma.cart.create({
			data: { userId, productId: dto.productId, count: dto.count }
		})
	}

	async getAll(userId: string) {
		const cart = await this.prisma.cart.findMany({
			where: { userId },
			include: { product: true }
		})

		if (!cart.length) {
			return { items: [], count: 0, total: 0 }
		}

		const count = await this.prisma.cart.count({
			where: { userId }
		})

		const total = cart.reduce((sum, item) => {
			return sum + Number(item.product.price) * item.count
		}, 0)

		return { items: cart, count, total }
	}

	async getCount(userId: string) {
		return this.prisma.cart.count({
			where: { userId }
		})
	}

	async getOne(id: string, userId: string) {
		const item = await this.prisma.cart.findFirst({
			where: { id, userId }
		})

		if (!item) throw new NotFoundException('Товар в корзине не найден')

		return item
	}

	async update(id: string, userId: string, dto: UpdateCartDto) {
		await this.getOne(id, userId)

		if (dto.count <= 0) return this.remove(id, userId)

		return this.prisma.cart.update({
			where: { id, userId },
			data: {
				productId: dto.productId,
				count: dto.count
			}
		})
	}

	async remove(id: string, userId: string) {
		await this.getOne(id, userId)

		return this.prisma.cart.delete({
			where: { id, userId }
		})
	}

	async reset(userId: string) {
		return this.prisma.cart.deleteMany({
			where: { userId }
		})
	}
}
