import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'

dotenv.config()

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')

	app.use(cookieParser())

	app.enableCors({
		origin: [/^(.*)/],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 200,
		credentials: true,
		allowedHeaders:
			'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for'
	})

	app.useGlobalPipes(new ValidationPipe())

	await app.listen(5000)
}
bootstrap()
