import { Injectable } from '@nestjs/common'

import { transporter, mailOptions } from 'src/config/nodemailer.config'

import { CreateEmailDto } from './dto/create-email.dto'
import { UpdateEmailDto } from './dto/update-email.dto'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class EmailService {
	async create(dto: CreateEmailDto) {
		const mail = {
			to: dto.to,
			subject: dto.title,
			text: dto.content
		}

		await transporter.sendMail({
			...mailOptions,
			...mail
		})

		return mail
	}
}
