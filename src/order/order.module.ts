import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { PrismaService } from 'src/prisma.service'
import { UserModule } from 'src/user/user.module'
import { CartModule } from 'src/cart/cart.module'
import { EmailModule } from 'src/email/email.module'

@Module({
	imports: [UserModule, CartModule, EmailModule],
	controllers: [OrderController],
	providers: [OrderService, PrismaService]
})
export class OrderModule {}
