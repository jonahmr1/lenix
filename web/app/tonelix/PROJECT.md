# Tonelix

Project brief — approved decisions and open questions.
Last updated: 2026-10-30.

## Purpose

Build a public music website where people can search for tracks, listen, and organize playlists. Tonelix is the product name. This is a fresh implementation, separate from the earlier project; “V2” is not part of the product or folder name.

The client chose a new section of the existing website at `/Users/lenix/Desktop/lenix/web`. New Tonelix code lives in `app/tonelix` and is served at `/tonelix`. Reuse the website's framework and shared UI components. Preserve the portfolio at `/` and older music app at `/tone`; do not copy its feature implementation into the new section.

## Working agreement

- The client retains project decisions unless they explicitly delegate them.
- The developer discovers relevant needs, researches options, explains benefits and drawbacks, and offers a recommendation so the client can choose.
- Obtain approval before implementation or unagreed additions. Lack of technical knowledge or silence is not delegation.
- Prioritize the strongest justified result over speed, while avoiding unnecessary complexity.
- Keep communication concise and preserve settled choices.

## Approved scope

- A public-facing website; no native Apple or Android app.
- Use Next.js as the app framework, keeping the interface and application server routes in one project alongside Supabase for accounts and data storage.
- Use TypeScript as the coding language.
- Use Bun for package management and local execution, Tailwind CSS for styling, and the Next.js App Router. The client approved this setup combination.
- Use the website's existing shadcn/ui components, theme provider, and shared styles. The provider already defaults to the system light/dark preference. Do not duplicate or override that behavior with Tonelix-specific theme CSS. No additional manual theme switch is requested. The three generated custom visual concepts were not selected.
- Use sidebar navigation with playlists visible beside the track list on desktop, and a collapsible menu on phones.
- Search and playback use YouTube.
- Latest visual requirement: no visible video player; the client requests hidden video. This supersedes the earlier visible top-left player choice. Mockups should show music controls without video.
- Accounts save playlists and preferences across devices.
- Google is the only sign-in option.
- Google sign-in is required before using the app, including search and playback. Guest search and listening are outside the first release.
- Use Supabase Free for accounts and data storage.
- Free-only operating budget. Paid services or upgrades require a new decision.
- More features may be discussed later; they are not automatically included.

## First release

The client selected option B: search, playback, manually managed playlists, and priority tiers, with the accounts and service choices above. Users choose which playlist to add a track to.

Playlists are private to their owner. Public playlists and sharing links are outside the first release.

Prevent duplicate entries for the same YouTube video within a playlist. The same video can belong to different playlists, with an independent tier in each. Separate uploads of the same song are not automatically identified as duplicates.

Smart playlist placement is deferred to a later release. It is not required to finish the first release.

## Smart playlist placement — deferred

The intended feature finds the best-fitting existing playlist for a track and adds it automatically. If no suitable playlist exists, tell the user and ask before creating one.

The latest matching direction is similarity to the playlist name. Earlier discussion mentioned similarity to existing tracks, followed by genre; whether those remain supporting signals is unresolved.

Handling ambiguous playlist names was deferred. The matching method, confidence threshold, and fallback behavior have not been selected. Deferring these questions does not remove the feature from the intended product.

## Priority tiers and playback

Priority tiers determine playback order within each playlist.

- Each new track starts at tier **1**.
- The minimum tier is **0**.
- “Listen less” adds one point, moving the track to a later tier: 1 → 2 → 3.
- Removing a point moves the track earlier: 5 → 4. A tier cannot go below 0.
- A track’s tier belongs to its playlist membership. Changing it in one playlist does not change it in another.
- On starting a playlist, group tracks by their saved tiers and play tiers in ascending order: 0, 1, 2, and so on.
- Shuffle tracks independently inside each tier. Finish that tier before advancing to the next.
- Each track plays once per playlist run. This is ordering, not weighted random selection or extra repetitions.
- Tier edits during playback are saved but do not change the current queue. Apply them when the playlist is started again.
- A finished track is not replayed because its tier changed.
- If a track cannot play, skip it, show a notice, and continue to the next queued track without asking the user.

Example: if tier 0 contains 20 tracks and tier 1 contains 10, shuffle and play the 20 tier-0 tracks first, then independently shuffle and play the 10 tier-1 tracks.

## Decisions still open

- Playback approach: the requested hidden player conflicts with YouTube API developer policies (section III.I.9). YouTube remains the requested source; no alternative source or implementation has been approved. Visual mockups do not establish playback feasibility.
- Remaining layout details and responsive behavior within the approved sidebar/collapsible-menu approach.
- Hosting, domain, and delivery arrangements; the Next.js, TypeScript, Bun, Tailwind CSS, and App Router setup is approved.
- Selection and setup of the client-owned Supabase project and Google/YouTube integrations.
- YouTube search limits and how to support public usage within the free-only budget.
- The smart-matching questions described above (deferred; not a first-release blocker).
- Remaining playback controls and behavior for interruptions and playlist edits during a run; unavailable tracks are skipped with a notice.

The client explicitly approved sharing the existing website's framework and components. Preserve its dependency versions and configuration rather than installing a second app. Google sign-in does not authorize YouTube account or playlist synchronization.

## Current status

The starter is integrated into `lenix/web/app/tonelix`, using the existing shadcn/ui button, theme provider, and shared styles. Duplicate route-specific theme CSS has been removed. The standalone app originally created in the chat workspace is superseded and retained as a backup, with its server stopped. This file is the authoritative Tonelix brief.

Accounts, search, playlists, and playback have not been implemented for the new section. Existing Supabase and Google integration code in the host website has not yet been assessed for reuse; no cloud resources were changed.

Verification: the host website passed TypeScript checks before and after integration. The new `/tonelix` route compiled successfully, returned HTTP 200, and was inspected in the browser with the current dark system appearance. The existing tracked application files and dependency files are unchanged. A full production build, mobile checks, and theme-switching checks have not been run for this integration.

Run the existing development, build, and type-check scripts from `/Users/lenix/Desktop/lenix/web`. Local preview uses Next.js's built-in server; no custom preview server or second package setup is needed.

## Reference material

Consult current documentation when implementing; service limits and terms may change.

- [YouTube embedded player API](https://developers.google.com/youtube/iframe_api_reference)
- [YouTube required minimum functionality](https://developers.google.com/youtube/terms/required-minimum-functionality)
- [Supabase pricing and free-plan limits](https://supabase.com/pricing)
- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-sign-in/auth-google)
