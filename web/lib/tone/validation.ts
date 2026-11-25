import { z } from 'zod'

export const playlistIdSchema = z.uuid()
export const videoIdSchema = z.base64url().length(11)
export const playlistNameSchema = z.string().trim().min(1)
export const searchQuerySchema = z.string().trim().min(1)
export const pageTokenSchema = z.string().max(512)
export const playlistPathSchema = z.templateLiteral([
  '/tone/playlist/',
  playlistIdSchema,
])
export const trackMembershipSchema = z.object({
  playlistId: playlistIdSchema,
  videoId: videoIdSchema,
  included: z.boolean(),
})
export const trackTierSchema = z.object({
  playlistId: playlistIdSchema,
  videoId: videoIdSchema,
  target: z.union([
    z.int().positive(),
    z.literal('ascend'),
    z.literal('descend'),
  ]),
})
