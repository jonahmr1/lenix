import { HugeiconsIcon } from '@hugeicons/react'
import { ExclamationMarkIcon, Tick02Icon, Time04Icon, X } from '@hugeicons/core-free-icons'
import { TimelineLayout } from '../timeline'

export const Timeline = () => (
	<TimelineLayout
		animate
		className='min-h-[600px] w-full max-w-full flex items-center justify-center'
		connectorColor='primary'
		iconColor='primary'
		items={[
			{
				id: 1,
				date: '2008-04-06',
				title: 'The First Connection',
				description: 'The day I touched a computer for the first time and realized that I\'m in love.',
				techs: ['Hardware', 'OS Basics'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
			},
			{
				id: 2,
				date: '2023-10-18',
				title: '@Revival States',
				description: 'Start my journey as a Full-Stack Developer, try to reach to the top best FiveM servers in the middle east, invite as much people as I can.',
				techs: ['Lua', 'YARN', 'Xampp', 'HeidiSQL'],
				icon: <HugeiconsIcon icon={X} />,
				color: 'destructive',
				iconHover: 'Could not find the right partner'
			},
			{
				id: 3,
				date: '2024-02-05',
				title: '@Trippler Scripts',
				description: 'Stopped copying and started creating. Launched Trippler Scripts Enterprise to provide the community with clean, optimized, and actually reliable scripts.',
				techs: ['Lua', 'TypeScript', 'FiveM Native', 'Figma', 'MySQL', 'Node.js', 'NPM', 'Git', 'MariaDB', 'React', 'SQL', 'Tailwind', 'Vite', 'Eslint', 'Prettier'],
				icon: <HugeiconsIcon icon={X} />,
				color: 'destructive',
				iconHover: 'Niche market',
				url: 'https://github.com/tripplerscripts'
			},
			{
				id: 4,
				date: '2024-09-17',
				title: '@Lenix Studio',
				description: 'Launched a consultancy serving 20+ studio clients. handled everything from end-to-end server builds, tailored scripts and servers problem solving to mentoring new developers from the commmuity.',
				techs: ['TypeScript', 'Lua', 'UML', 'Business Strategy'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/lenixstudio'
			},
			{
				id: 6,
				date: '2025-09-10',
				title: 'The FiveM Library',
				description: 'Authored the #1 most used FiveM NPM package globally. Optimized Lua 5.4/5.5 utility scripts to eliminate server exploitation and peak-load lag.',
				techs: ['Lua5.4', 'FiveM Native', 'TypeScript', 'NPM'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/tripplerscripts/tr_lib'
			},
			{
				id: 24,
				date: '2025-09-10',
				title: 'Global Standard Module Kit',
				description: 'Engineered a high-utility module ecosystem designed to eliminate redundant code across multiple development environments. Scaled to #3 globally on NPM rankings, providing essential logic and optimized utilities for thousands of developers in the FiveM Community.',
				techs: ['FiveM Native', 'NPM', 'TypeScript', 'Lua5.4'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/tripplerscripts/tr_kit'
			},
			{
				id: 7,
				date: '2025-09-13',
				title: 'The Interoperability Layer',
				description: 'Built a smart compatibility layer that lets scripts made for different frameworks talk to each other without manual rewriting.',
				techs: ['Lua5.4', 'API', 'FiveM Native'],
				icon: <HugeiconsIcon icon={ExclamationMarkIcon} />,
				color: 'secondary',
				iconHover: 'Abandoned',
				url: 'https://github.com/tripplerscripts/tr_adapter'
			},
			{
				id: 8,
				date: '2025-10-10',
				title: 'Automated Protection Pipeline',
				description: 'Developed a tool that automatically minifies and obfuscates code before release, keeping my intellectual property safe from community leakers.',
				techs: ['JavaScript', 'Terser', 'Node.js'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/lenixstudio/lenix_builder'
			},
			{
				id: 9,
				date: '2025-10-13',
				title: 'Documentation Hub',
				description: 'Built a central home for all my projects. Create a space where developers can actually find what they need, making my tools easier to use and much more professional to scale.',
				techs: ['Next.js', 'MDX', 'Tailwind', 'Vercel', 'Nextra', 'Node.js'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/tripplerscripts/docs'
			},
			{
				id: 10,
				date: '2025-11-23',
				title: 'Engine-Level Graphics Fix',
				description: 'Authored "fivem-glsl" to solve rendering bugs and blur limitations using custom shaders, now widely adopted by the community.',
				techs: ['GLSL', 'Shaders', 'Graphics Programming', 'FiveM', 'Chromium', 'Node.js', 'JavaScript'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/gtasnail/fivem-glsl/pull/2'
			},
			{
				id: 11,
				date: '2025-12-01',
				title: 'B2B Strategic Partnerships',
				description: 'Negotiated and built a sponsorship custom scripts for the top #10 AR-SA servers, reaching massive traffic levels and community engagement.',
				techs: ['TypeScript', 'MySQL', 'Figma', 'Axios', 'Node.js', 'FiveM Native'],
				icon: <HugeiconsIcon icon={X} />,
				color: 'destructive',
				iconHover: 'Parterships weren\'t professional',
				url: 'https://github.com/tripplerscripts/tr_sponsor'
			},
			{
				id: 12,
				date: '2025-12-13',
				title: 'Interactive DX Configuration CLI',
				description: 'Engineered a tool that walks you through ESLint/Prettier setup, teaching you the rules instead of just importing presets.',
				techs: ['Node.js', 'ESLint', 'Prettier', 'ESLint Stylistic', 'NPM'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/jonahmr1/lenix'
			},
			{
				id: 13,
				date: '2026-01-10',
				title: 'Automated Infrastructure (txAdmin)',
				description: 'Built a DevOps YAML-based injection workflows to automate server deployment (CI/CD), SQL syncing, and script installation in seconds.',
				techs: ['YAML', 'Github-Actions', 'SQL'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/lenixstudio/lenix_txadminrecipes'
			},
			{
				id: 5,
				date: '2026-01-27',
				title: 'Core Member @Project Sloth',
				description: 'Selected for one of the most respected organizations if not the most into the dev members. Contributing to open-source tools used by thousands of servers.',
				techs: ['Lua5.5', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Eslint', 'Prettier'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/orgs/Project-Sloth/people'
			},
			{
				id: 14,
				date: '2026-02-01',
				title: 'Lenix SDK: Polyglot Engineering',
				description: 'Bridged .NET and TypeScript to create a high-performance SDK to run complex operations for in-game community developers.',
				techs: ['C#', 'TypeScript', '.Net', 'React', 'Vite', 'Node.js', 'Tailwind', 'Eslint'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/lenixstudio/lenix_sdk'
			},
			{
				id: 15,
				date: '2026-02-09',
				title: 'Architectural Framework Refactor',
				description: 'Converted a major banking system to the QBox framework, pushing 142 commits to rewrite the core logic from scratch.',
				techs: ['QBox', 'Typescript', 'Mariadb', 'Bun', 'TanStack', 'Node.js', 'Zod', 'Vite', 'Tailwind', 'FiveM Native', 'Emotion', 'Radix-ui', 'Recharts', 'Prettier'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/jonahmr1/ox_banking'
			},
			{
				id: 21,
				date: '2026-02-10',
				title: 'Lua OOP Standards',
				description: 'Introduced Java-like OOP modules to Lua with a ready-to-use safe annotation and built a CLI to setup and organize a "lua_modules" folder just like "node_modules".',
				techs: ['Lua5.4', 'LuaRocks', 'Shell', 'MacOS Internals'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/jonahmr1/lenix/tree/main/oop'
			},
			{
				id: 16,
				date: '2026-02-17',
				title: 'The Engineering Portfolio',
				description: 'Built this digital space to showcase my technical journey and modern UI design patterns. A testament to my commitment to excellence.',
				techs: ['Next.js', 'Tailwind', 'Vite', 'Node.js', 'Shadcn', 'Resend', 'Octokit', 'Vercel', 'Babel', 'Tailwind', 'Radix-ui', 'Framer Motion', 'Recharts', 'Eslint', 'Prettier'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/jonahmr1/portfolio'
			},
			{
				id: 17,
				date: '2026-03-08',
				title: 'Thrivenix: Mobile App',
				description: 'A cross-platform lifestyle app built integrated with an AI chat tab. Support multiple language, themes, AI settings, app performance, and more.',
				techs: ['React Native', 'Expo', 'Supabase', 'Node.js', 'PLpgSQL', 'Groq', 'Twilio', 'Uniwind', 'HeroUI', 'i18next', 'React', 'Tailwind', 'Eslint', 'Prettier'],
				icon: <HugeiconsIcon icon={ExclamationMarkIcon} />,
				color: 'secondary',
				iconHover: 'Abandoned',
				url: 'https://github.com/jonahmr1/thrivenix'
			},
			{
				id: 18,
				date: '2026-03-08',
				title: 'Enterprise Management Platform',
				description: 'Built a massive management suite for educational institutes, running natively on Mac, Windows, and Linux. Plus to that it contains a compatible web interface.',
				techs: ['Tauri', 'React', 'Rust', 'Supabase', 'PostgreSql', 'Deno', 'Tailwind', 'Shadcn', 'TanStack', 'Next.js', 'Radix-ui', 'i18next', 'Vite', 'Eslint', 'Prettier'],
				icon: <HugeiconsIcon icon={ExclamationMarkIcon} />,
				color: 'secondary',
				iconHover: 'Abandoned',
				url: 'https://github.com/jonahmr1/institute'
			},
			{
				id: 19,
				date: '2026-03-09',
				title: 'Sysenix: Next-Gen AI Desktop OS',
				description: 'Created a smart system agent powered with AI that track, controls and execute tasks on the user\'s Mac for him with a high quality UX.',
				techs: ['macOS', 'Rust', 'AI', 'Systems'],
				icon: <HugeiconsIcon icon={Time04Icon} />,
				color: 'pending',
				iconHover: 'In progress',
				url: 'https://github.com/jonahmr1/sysenix'
			},
			{
				id: 20,
				date: '2026-03-19',
				title: 'High-Performance AI CLI',
				description: 'Built a lightning-fast AI interface that prioritizes memory safety and sub-millisecond response times.',
				techs: ['Rust', 'Groq'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/jonahmr1/lenix/tree/main/ai'
			},
			{
				id: 21,
				date: '2026-03-21',
				title: 'Commenix: AI-Powered DX Tooling',
				description: 'A VS Code extension that reads your staged code changes and automatically writes perfect Git commit messages that support multiple AI models.',
				techs: ['VS Code API', 'Groq', 'Node.js', 'TypeScript', 'Eslint', 'Prettier'],
				icon: <HugeiconsIcon icon={Tick02Icon} />,
				color: 'success',
				url: 'https://github.com/jonahmr1/commenix'
			},
			{
				id: 23,
				date: '2026-03-25',
				title: 'Tonelix: AI Mobile Music App',
				description: 'Built a cross-platform music app that uses YouTube as a data source, integrating AI for various tasks.',
				icon: <HugeiconsIcon icon={X} />,
				color: 'secondary',
				iconHover: 'Canceled',
				url: 'https://github.com/jonahmr1/tonelix'
			},
			{
				id: 22,
				date: '2026-04-07',
				title: 'Intellenix: AI Mobile App Assistant',
				description: 'Built a cross-platform assistant that rejects the "generalist" approach. Instead of knowing a little about everything, Intellenix is engineered to go deep into specific domains and tasks, providing high-level expertise where general AI usually fails.',
				techs: ['React Native', 'TypeScript', 'Expo', 'React', 'Supabase', 'Groq', 'Node.js', 'Vercel', 'Tamagui', 'i18next', 'Eslint', 'Prettier', 'Stylistic'],
				icon: <HugeiconsIcon icon={ExclamationMarkIcon} />,
				color: 'secondary',
				iconHover: 'Abandoned',
				url: 'https://github.com/jonahmr1/intellenix'
			},
		]}
		size='md'
	/>
)
