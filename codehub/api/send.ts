import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import formidable from 'formidable'
import { readFileSync } from 'fs'

export const config = { api: { bodyParser: false } }

const getErrorMessage = (error: unknown) =>
	error instanceof Error ? error.message : String(error)

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'POST') return res.status(405).end()

	const resendKey = process.env.RESEND_API_KEY
	if (typeof resendKey !== 'string')
		return res.status(500).json({ error: 'Missing environment variable: RESEND_API_KEY' })

	const resend = new Resend(resendKey)
	const form = formidable({
		multiples: true,
		allowEmptyFiles: true,
		minFileSize: 0,
	})

	let fields: formidable.Fields = {}
	let files: formidable.Files = {}

	try {
		;[fields, files] = await form.parse(req)
	} catch (err) {
		if ((err as { code?: string }).code !== '1016')
			return res
				.status(500)
				.json({ error: `Failed to parse form data: ${getErrorMessage(err)}` })
	}

	const name = fields.name?.[0]
	const email = fields.email?.[0]
	const message = fields.message?.[0]
	const subject = fields.subject?.[0]
	const subscribe = fields.subscribe?.[0]

	if (
		email?.length === undefined
		|| message?.length === undefined
		|| subject?.length === undefined
	)
		return res.status(400).json({ error: 'Invalid request' })

	if (subscribe === 'on')
		try {
			const audienceId = process.env.RESEND_AUDIENCE_ID
			if (typeof audienceId !== 'string')
				return res
					.status(500)
					.json({ error: 'Missing environment variable: RESEND_AUDIENCE_ID' })

			const { error } = await resend.contacts.create({
				audienceId,
				email,
				firstName: name,
				unsubscribed: false,
			})
			if (error) return res.status(500).json({ error })
		} catch (error) {
			return res
				.status(500)
				.json({ error: `Failed to subscribe: ${getErrorMessage(error)}` })
		}

	const attachments = Object.values(files)
		.flat()
		.filter(
			(file): file is formidable.File =>
				file !== undefined && file.size > 0 && file.originalFilename !== '',
		)
		.map(file => ({
			filename: file.originalFilename ?? 'corrupted file name',
			content: readFileSync(file.filepath),
		}))

	try {
		const { error } = await resend.emails.send({
			from: 'Codehub <codehub@lenix.dev>',
			replyTo: email,
			to: 'jonahmr1@icloud.com',
			subject,
			text: `${message}\n\nReply to: ${email}`,
			attachments,
		})

		if (error) return res.status(500).json({ error })
	} catch (error) {
		return res
			.status(500)
			.json({ error: `Failed to send email: ${getErrorMessage(error)}` })
	}

	res.status(200).json({ ok: true })
}
