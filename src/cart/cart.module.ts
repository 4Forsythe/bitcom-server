import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'

@Module({
	exports: [CartService],
	controllers: [CartController],
	providers: [CartService, ProductService, PrismaService]
})
export class CartModule {}
