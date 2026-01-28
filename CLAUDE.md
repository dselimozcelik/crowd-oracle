# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Architecture

CrowdOracle is a prediction platform where users vote on events and build trust scores based on prediction accuracy. Built with Next.js 16 (App Router), React 19, Supabase, and Tailwind CSS v4.

### Dual Scoring System
The platform uses two scoring mechanisms:
- **Raw counts**: Simple yes/no vote tallies
- **Weighted scores**: Votes weighted by user trust scores (0-1 scale)

Trust score tiers are defined in `src/lib/constants.ts`: Newcomer (0-0.55), Regular (0.55-0.65), Reliable (0.65-0.75), Expert (0.75-0.85), Superforecaster (0.85-1.0).

### Key Directories
- `src/actions/` - Server actions for auth, voting, and event management
- `src/lib/supabase/` - Supabase client setup (client.ts for browser, server.ts for RSC/actions)
- `src/types/database.ts` - TypeScript types mirroring Supabase schema
- `src/app/(main)/` - Authenticated routes (requires login)
- `src/app/(auth)/` - Login/signup pages
- `src/app/admin/` - Admin-only routes for event management

### Database
Uses Supabase with RPC functions:
- `settle_event(p_event_id, p_outcome, p_settled_by)` - Marks event as settled and updates vote correctness
- `recalculate_rankings()` - Updates user rankings after settlement

Key tables: `profiles`, `user_stats`, `events`, `votes`, `categories`, `badges`, `user_badges`
Key views: `event_analytics`, `leaderboard`, `platform_stats`

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (for OAuth redirects)

### Path Alias
Use `@/*` to import from `src/*` (configured in tsconfig.json).

## Design Guidelines

### Anti-AI Aesthetic
The UI should feel human, editorial, and premium—not "AI-generated."

**Avoid:**
- Perfect symmetry everywhere
- Generic gradient backgrounds (purple-blue is overused)
- Uniform rounded corners on everything
- Too much whitespace uniformity
- Overly smooth, sterile animations
- Card layouts with identical shadows

**Do:**
- Intentional asymmetry and tension
- One accent color used sparingly, not gradients everywhere
- Mix of sharp and rounded corners
- Varied spacing—some tight, some loose
- Typography with character (contrasting weights and sizes)
- Micro-interactions that feel slightly imperfect
- Editorial layouts (Bloomberg, The Athletic style—not generic SaaS)

### Reference Sites
- Polymarket.com (clean, data-focused)
- Kalshi.com (professional, finance-feel)
- Bloomberg.com (editorial, dense but clear)

### Trending Marquee Component
- Full-width banner at top of page
- Background: near-black (#0a0a0a) with subtle noise texture, NOT purple gradients
- Scroll: right-to-left, smooth, dignified pace
- Content: 8-10 trending predictions with "[Question]" [YES] [NO] format
- Hover pauses animation (CSS animation-play-state: paused)
- Click YES/NO for immediate vote
- Seamless loop via duplicated items
- Subscribe to new events via Supabase realtime
