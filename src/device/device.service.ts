import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { DeviceParamsDto } from './dto/device-params.dto'

@Injectable()
export class DeviceService {
	constructor(private prisma: PrismaService) {}

	async getAll(params?: DeviceParamsDto) {
		const { take, skip } = params

		const devices = await this.prisma.device.findMany({
			take: +take || undefined,
			skip: +skip || 0,
			orderBy: {
				name: 'asc'
			}
		})

		const count = await this.prisma.device.count()

		return { items: devices, count }
	}

	async getOne(id: string) {
		const device = await this.prisma.device.findUnique({
			where: { id }
		})

		return device
	}
}
