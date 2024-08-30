import { Module } from '@nestjs/common'
import { WishListService } from './wish-list.service'
import { WishListController } from './wish-list.controller'
import { ProductService } from 'src/product/product.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [WishListController],
	providers: [WishListService, ProductService, PrismaService]
})
export class WishListModule {}
