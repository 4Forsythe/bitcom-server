import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CartModule } from './cart/cart.module'
import { ProductModule } from './product/product.module'
import { ProductCategoryModule } from './product-category/product-category.module';
import { DeviceModule } from './device/device.module';

@Module({
	imports: [AuthModule, UserModule, ProductModule, PostModule, CartModule, ProductCategoryModule, DeviceModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
