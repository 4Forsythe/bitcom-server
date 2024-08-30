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
				...(brandId && { brandId }),
				...(modelId && { modelId })
			},
			take: +take || 20,
			skip: +skip || 0,
			orderBy: {
				...(sortBy &&
					orderBy && {
						[sortBy]: orderBy
					})
			},
			select: {
				id: true,
				name: true,
				price: true,
				count: true,
				barcode: true,
				category: true,
				device: true,
				brand: true,
				model: true
			}
		})

		const count = await this.prisma.product.count({
			where: {
				OR: whereOr,
				...(categoryId && { categoryId }),
				...(deviceId && { deviceId }),
				...(brandId && { brandId }),
				...(modelId && { modelId })
			}
		})

		return { items: products, count }
	}

	async getByIds(ids: string[]) {
		const products = await this.prisma.product.findMany({
			where: { id: { in: ids } },
			select: {
				id: true,
				name: true,
				price: true,
				count: true,
				barcode: true,
				category: true,
				device: true,
				brand: true,
				model: true
			}
		})

		const count = await this.prisma.product.count({
			where: { id: { in: ids } }
		})

		return { items: products, count }
	}

	async getOne(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				price: true,
				count: true,
				barcode: true,
				category: true,
				device: true,
				brand: true,
				model: true
			}
		})

		if (!product) throw new NotFoundException('Товар не найден')

		return product
	}
}
