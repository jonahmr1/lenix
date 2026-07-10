import type { ReactNode } from "react";

export const Ul = ({ children }: { children: ReactNode }) => <ul className="mb-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>