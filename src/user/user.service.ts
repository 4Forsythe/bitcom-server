import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateUserDto) {
		const user = await this.prisma.user.findUnique({
			where: { phone: dto.phone }
		})

		if (user)
			throw new BadRequestException(
				'Пользователь с указанным номером телефона уже существует'
			)

		const data = {
			name: dto.name || null,
			phone: dto.phone
		}

		return this.prisma.user.create({
			data
		})
	}

	async getAll() {
		return this.prisma.user.findMany()
	}

	async getOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		return user
	}

	async getByPhone(phone: string) {
		const user = await this.prisma.user.findUnique({
			where: { phone }
		})

		return user
	}

	async getByCondition(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { role: true }
		})

		return user
	}

	async update(id: string, dto: UpdateUserDto) {
		const user = await this.getOne(id)

		if (!user) throw new NotFoundException('Пользователь не найден')

		if (dto.phone) {
			const user = await this.prisma.user.findFirst({
				where: { phone: dto.phone, NOT: { id } }
			})

			if (user) throw new ConflictException('Указанный номер телефона занят')
		}

		const response = {
			name: dto.name || null,
			email: dto.email || null,
			phone: dto.phone
		}

		return this.prisma.user.update({
			where: { id },
			data: response
		})
	}

	async remove(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		return this.prisma.user.delete({
			where: { id }
		})
	}
}
