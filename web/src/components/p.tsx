import type { ReactNode } from "react";

export const P = ({ children }: { children: ReactNode }) => <p className="leading-7 not-first:mt-6">{children}</p>
