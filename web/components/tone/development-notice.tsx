import { Badge } from '@/components/ui/badge'

export function DevelopmentNotice() {
  return (
    <aside
      aria-label="Development notice"
      className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-b border-orange-200 bg-orange-100 px-4 py-2 text-center text-xs text-orange-900 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200"
    >
      <Badge
        variant="outline"
        className="border-orange-400/50 bg-transparent text-inherit dark:bg-transparent"
      >
        In development
      </Badge>
      <p>Tonelix is still being built. Features may change.</p>
    </aside>
  )
}
