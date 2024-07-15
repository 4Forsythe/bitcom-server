import { Controller, Get, Query, Param } from '@nestjs/common'

import { DeviceService } from './device.service'
import { DeviceParamsDto } from './dto/device-params.dto'

@Controller('device')
export class DeviceController {
	constructor(private readonly deviceService: DeviceService) {}

	@Get()
	getAll(@Query() params?: DeviceParamsDto) {
		return this.deviceService.getAll(params)
	}

	@Get(':id')
	getOne(@Param('id') id: string) {
		return this.deviceService.getOne(id)
	}
}
