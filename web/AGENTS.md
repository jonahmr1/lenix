Add only what the current request requires. If something can be removed without affecting the requested result, leave it out.

- Never modify files in `components/ui/`. Use their public props and composition, and keep app-specific behavior outside that directory.
- Consult the official shadcn MCP before implementing UI. Prefer existing components and their documented composition and defaults. If MCP is unavailable, consult the official documentation and installed component source.
- Start with the existing components' documented composition, props, and defaults. Use their built-in layout and behavior before introducing custom controls, state wiring, or CSS overrides.
- Keep the component tree direct. Every additional function, wrapper, provider, and state field must serve a concrete current requirement. Do not add structure for assumed behavior or future features.
- Work one requested step at a time. Respect the user's chosen architecture and treat their simplified implementation as the baseline. Do not reintroduce complexity they removed.
- When fixes start accumulating positioning rules, specificity overrides, or state workarounds, revisit the underlying composition and simplify it. Do not modify shared components merely to compensate for an unnecessarily complicated caller.
- Use the project's working development setup for previews. Do not change project configuration solely to accommodate the agent's tooling or choice of preview address.
- Always verify UI issues and changes in the browser: inspect the rendered appearance and exercise the relevant interactions before giving a definitive diagnosis or reporting a fix as complete. Code inspection, screenshots supplied by the user, type checks, and successful page responses alone do not establish current visual or interactive correctness. If browser verification is blocked, report the blocker and distinguish what was confirmed from what remains unverified.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
