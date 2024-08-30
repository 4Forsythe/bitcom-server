import * as dotenv from 'dotenv'
import * as nodemailer from 'nodemailer'

dotenv.config()

const user = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASSWORD

export const transporter = nodemailer.createTransport({
	service: 'yandex',
	port: 465,
	secure: true,
	auth: {
		user,
		pass
	},
	tls: {
		rejectUnauthorized: true
	}
})

export const mailOptions = {
	from: `Bitcom <${user}>`
}
