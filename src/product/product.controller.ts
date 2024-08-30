import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common'

import { ProductService } from './product.service'
import { ProductParamsDto } from './dto/product-params.dto'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	getAll(@Query() params?: ProductParamsDto) {
		return this.productService.getAll(params)
	}

	@Post()
	getByIds(@Body() dto: { ids: string[] }) {
		return this.productService.getByIds(dto.ids)
	}

	@Get(':id')
	getOne(@Param('id') id: string) {
		return this.productService.getOne(id)
	}
}
