import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { ProductParamsDto } from './dto/product-params.dto'
import { switchKeyboard } from './utils/switch-keyboard.utils'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAll(params?: ProductParamsDto) {
		const {
			name,
			categoryId,
			deviceId,
			brandId,
			modelId,
			sortBy,
			orderBy,
			take,
			skip
		} = params

		const { ru, en } = switchKeyboard(name || '')

		const whereOr = [
			...(name ? [{ name: { contains: name } }] : []),
			{ name: { contains: ru } },
			{ name: { contains: en } }
		]

		const products = await this.prisma.product.findMany({
			where: {
				OR: whereOr,
				...(categoryId && { categoryId }),
				...(deviceId && { deviceId }),
				...(brandId && { brandId })
			},
			include: { category: true, brand: true, device: true },
			take: +take || 10,
			skip: +skip || 0,
			orderBy: {
				...(sortBy &&
					orderBy && {
						[sortBy]: orderBy
					})
			}
		})

		return { items: products, count: products.length }
	}

	async getSimilar(id: string, params?: { take: number }) {
		const { take } = params

		const product = await this.getOne(id)

		const products = await this.prisma.product.findMany({
			where: {
				OR: [
					{ name: { contains: product.name } },
					product.categoryId ? { categoryId: product.categoryId } : {},
					product.deviceId ? { deviceId: product.deviceId } : {},
					product.brandId ? { brandId: product.brandId } : {}
				]
			},
			include: { category: true, brand: true, device: true },
			take: +take || 10,
			orderBy: {
				createdAt: 'desc'
			}
		})

		const items = products.filter((item) => item.id !== product.id)

		return { items, count: items.length }
	}

	async getByIds(ids: string[]) {
		const products = await this.prisma.product.findMany({
			where: { id: { in: ids } },
			include: { category: true, brand: true, device: true }
		})

		const count = await this.prisma.product.count({
			where: { id: { in: ids } }
		})

		return { items: products, count }
	}

	async getOne(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			include: { category: true, brand: true, device: true }
		})

		if (!product) throw new NotFoundException('Товар не найден')

		return product
	}

	async getTotal() {
		return this.prisma.product.count()
	}
}
