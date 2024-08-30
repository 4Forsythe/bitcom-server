import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductService } from 'src/product/product.service'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class WishListService {
	constructor(
		private productService: ProductService,
		private prisma: PrismaService
	) {}

	async toggle(id: string, userId: string) {
		const item = await this.prisma.wishList.findFirst({
			where: { productId: id, userId }
		})

		if (item) {
			return this.remove(item.id, userId)
		} else {
			return this.create(id, userId)
		}
	}

	async create(id: string, userId: string) {
		await this.productService.getOne(id)

		return this.prisma.wishList.create({
			data: { userId, productId: id }
		})
	}

	async getAll(userId: string) {
		const list = await this.prisma.wishList.findMany({
			where: { userId },
			include: { product: true }
		})

		if (!list.length) {
			return { items: [], count: 0 }
		}

		const count = await this.prisma.wishList.count({
			where: { userId }
		})

		return { items: list, count }
	}

	async getCount(userId: string) {
		return this.prisma.wishList.count({
			where: { userId }
		})
	}

	async getOne(id: string, userId: string) {
		const item = await this.prisma.wishList.findFirst({
			where: { id, userId },
			include: { product: true }
		})

		if (!item) throw new NotFoundException('Товара нет в списке желаемого')

		return item
	}

	async remove(id: string, userId: string) {
		await this.getOne(id, userId)

		return this.prisma.wishList.delete({
			where: { id, userId }
		})
	}

	async reset(userId: string) {
		return this.prisma.wishList.deleteMany({
			where: { userId }
		})
	}
}
