import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { RiDiscordFill } from '@remixicon/react'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Code Hub',
    },
		links: [
      {
        type: 'icon',
        icon: <RiDiscordFill />,
        text: 'Blog',
        url: 'https://discord.gg/VgnvM6CzwG',
				external: true
      },
    ],
  };
}
