import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
	return ['', '/contact', '/docs', '/legal'].map((path) => ({
		url: `https://lenix.dev${path}`,
	}))
}
