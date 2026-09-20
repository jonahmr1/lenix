'use server'

import { asserts, waste } from '@lenix/lenix'
import { Resend } from 'resend'

const key = process.env.RESEND_API_KEY
asserts(key, 'Missing environment variable: RESEND_API_KEY')

export async function sendMessage(form: FormData) {
	const email = form.get('email')
	const name = form.get('name')
	const subject = form.get('subject')
	const message = form.get('message')

	if (
		typeof email !== 'string' || !email.trim() ||
		typeof name !== 'string' || !name.trim() ||
		typeof subject !== 'string' || !subject.trim() ||
		typeof message !== 'string' || !message.trim() ||
		message.length > 1000
	) return { error: true, message: 'Please check your fields.' }

	try {
		const resend = new Resend(key)
		const { error } = await resend.emails.send({
			from: 'Lenix <contact@lenix.dev>',
			to: 'lenixdev@icloud.com',
			replyTo: email,
			subject,
			text: `${name}\n\n${message}`,
		})

		return error ? { error: true, message: 'Failed to send.' } : { error: false, message: 'Sent!' }
	} catch {
		return { error: true, message: 'Failed to send.' }
	}
}