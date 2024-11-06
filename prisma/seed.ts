import { PrismaClient } from '@prisma/client'

import { hash } from 'argon2'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
	try {
		await down()
		await up()
	} catch (error) {
		console.error(error)
	}
}

async function up() {
	const user = await prisma.user.create({
		data: {
			name: 'Test1',
			email: 'bitcom63@yandex.ru',
			password: await hash('12345'),
			role: true,
			isActive: true
		}
	})

	const postCategory = await prisma.postCategory.create({
		data: {
			name: faker.word.sample()
		}
	})

	await prisma.post.createMany({
		data: Array.from({ length: 5 }, () => ({
			title: faker.lorem.words({ min: 3, max: 5 }),
			content: faker.lorem.paragraphs({ min: 1, max: 5 }),
			imageUrl: faker.image.url(),
			userId: user.id,
			categoryId: postCategory.id
		}))
	})

	await prisma.product.createMany({
		data: Array.from({ length: 20 }, () => ({
			name: faker.commerce.productName(),
			count: faker.number.int({ min: 0, max: 50 }),
			price: Number(faker.commerce.price()).toFixed(2),
			barcode: faker.string.nanoid(9),
			model: faker.commerce.product(),
			imageUrl: faker.image.url()
			// categoryId: `00${faker.number.int}`,
			// brandId: `00000000${faker.number.int({ min: 1, max: 9 })}`,
			// deviceId: `00000000${faker.number.int({ min: 1, max: 9 })}`
		}))
	})

	const categories = await prisma.productCategory.findMany({
		select: {
			id: true
		}
	})

	const updates = categories.map((category) =>
		prisma.productCategory.update({
			where: { id: category.id },
			data: {
				imageUrl: `/static/product-categories/images/${category.id}.jpg`
			}
		})
	)

	await Promise.all(updates)
}

async function down() {
	await prisma.user.deleteMany()
	await prisma.post.deleteMany()
	await prisma.product.deleteMany()
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (error) => {
		console.error(error)
		await prisma.$disconnect()
		process.exit(1)
	})
