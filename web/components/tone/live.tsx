import { Badge } from '../ui/badge'

export const Live = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-[0.5vw]">
    <Badge className="size-[1vh] bg-red-600 p-0" />
    {children}
  </div>
)
