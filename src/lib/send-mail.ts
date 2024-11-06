import * as fs from 'fs'
import * as handlebars from 'handlebars'

import { transporter, mailOptions } from 'src/config/nodemailer.config'

interface MailReplacements {
	code?: string
	returnUrl?: string
}

interface SendMailOptions {
	to: string
	subject: string
	text?: string
	html?: {
		path: string
		replacements: MailReplacements
	}
}

export const sendMail = async (options: SendMailOptions) => {
	let html = undefined

	if (options.html) {
		const source = fs.readFileSync(options.html.path, 'utf-8').toString()

		if (source) {
			const template = handlebars.compile(source)

			const { code, returnUrl } = options.html.replacements

			const replacements: MailReplacements = {
				code,
				returnUrl
			}

			html = template(replacements)
		}
	}

	return transporter.sendMail({
		...mailOptions,
		to: options.to,
		subject: options.subject,
		text: options.text,
		html: html
	})
}
