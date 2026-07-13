import type { JSX, ReactNode } from 'react'

/**
 * Props for {@link Code}.
 */
export type CodeProps = {
	/**
	 * Content rendered inside the code element.
	 */
	children: ReactNode
}

/**
 * Renders inline code text with the default Lenix documentation styling.
 *
 * @example
 * ```tsx
 * <Code>this is an example</Code>
 * ```
 */
export const Code = ({ children }: CodeProps): JSX.Element => (
	<code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
		{children}
	</code>
)
