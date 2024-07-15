import { Controller, Get, Param, Query } from '@nestjs/common'

import { ProductService } from './product.service'
import { ProductParamsDto } from './dto/product-params.dto'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	getAll(@Query() params?: ProductParamsDto) {
		return this.productService.getAll(params)
	}

	@Get(':id')
	getOne(@Param('id') id: string) {
		return this.productService.getOne(id)
	}
}
