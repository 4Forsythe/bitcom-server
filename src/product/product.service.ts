import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { ProductParamsDto } from './dto/product-params.dto'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAll(params?: ProductParamsDto) {
		const { sortBy, orderBy, take, skip } = params

		const products = await this.prisma.product.findMany({
			take: +take || 20,
			skip: +skip || 0,
			orderBy: {
				[sortBy]: orderBy
			},
			select: {
				id: true,
				name: true,
				price: true,
				count: true,
				barcodes: true,
				category: true,
				device: true,
				brand: true,
				model: true
			}
		})

		const count = await this.prisma.product.count()

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
				barcodes: true,
				category: true,
				device: true,
				brand: true,
				model: true
			}
		})

		return products
	}

	async getOne(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				price: true,
				count: true,
				barcodes: true,
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
