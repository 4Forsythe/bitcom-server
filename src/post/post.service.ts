import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import * as cheerio from 'cheerio'

import { PrismaService } from 'src/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostParamsDto } from './dto/post-params.dto'

@Injectable()
export class PostService {
	constructor(private prisma: PrismaService) {}

	async create(userId: string, dto: CreatePostDto) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { role: true }
		})

		if (!user.role)
			throw new ForbiddenException(
				'У пользователя недостаточно прав для выполнения этой функции'
			)

		let imageUrl = dto.imageUrl

		const $ = cheerio.load(dto.content)
		const image = $('img').first()

		if (image.length) {
			imageUrl = image.attr('src')
		}

		const data = {
			title: dto.title,
			content: dto.content,
			imageUrl: imageUrl,
			videoUrl: dto.videoUrl,
			isPublic: dto.isPublic
		}

		return this.prisma.post.create({
			data: {
				...data,
				user: { connect: { id: userId } }
			}
		})
	}

	async getAll(params?: PostParamsDto) {
		const { sortBy, orderBy, take, skip } = params

		const posts = await this.prisma.post.findMany({
			take: +take || 20,
			skip: +skip || 0,
			orderBy: {
				[sortBy]: orderBy
			}
		})

		const count = await this.prisma.post.count()

		const items = posts.map((post) => {
			return {
				...post,
				content:
					post.content.length > 200
						? `${post.content.slice(0, 200)}...`
						: post.content
			}
		})

		return { items, count }
	}

	async getMy(userId: string, params?: PostParamsDto) {
		const { sortBy, orderBy, take, skip } = params

		const posts = await this.prisma.post.findMany({
			where: { userId },
			take: +take || 10,
			skip: +skip || 0,
			orderBy: {
				[sortBy]: orderBy
			}
		})

		const count = await this.prisma.post.count()

		const items = posts.map((post) => {
			return {
				...post,
				content:
					post.content.length > 200
						? `${post.content.slice(0, 200)}...`
						: post.content
			}
		})

		return { items, count }
	}

	async getOne(id: string) {
		const post = await this.prisma.post.findUnique({
			where: { id }
		})

		if (!post) throw new NotFoundException('Статья не найдена')

		await this.prisma.post.update({
			where: { id },
			data: { views: { increment: 1 } }
		})

		return post
	}

	async update(id: string, dto: UpdatePostDto) {
		const post = await this.prisma.post.findUnique({
			where: { id }
		})

		if (!post) throw new NotFoundException('Статья не найдена')

		const data = {
			title: dto.title,
			content: dto.content,
			imageUrl: dto.imageUrl,
			videoUrl: dto.videoUrl,
			isPublic: dto.isPublic
		}

		return this.prisma.post.update({
			where: { id },
			data
		})
	}

	async remove(id: string) {
		return this.prisma.post.delete({
			where: { id }
		})
	}
}
