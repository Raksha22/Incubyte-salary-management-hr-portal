# AI collaboration

## How AI was used

- **Scaffolding and wiring:** Rails API routes, controllers, model validations, and the React shell were iterated quickly with AI assistance so time could go toward product behavior (insights, seeding, tests).
- **Environment hardening:** Ruby 3.0.2 / Bundler / native extension edge cases were diagnosed with AI help and pinned or documented in the Gemfile and README.
- **Verification:** AI was used to propose test cases and API contracts, then outputs were checked against real `rails test` runs and manual UI passes.

## Instructions pattern that worked well

- Give **constraints explicitly** (Rails 7, SQLite, React + Vite, 10k seed from name files, no Docker requirement for local dev).
- Ask for **small diffs** with file paths and acceptance criteria (“index must return `X-Total-Count` header”).
- Request **tests in the same change** when touching core logic.

## Quality guardrails

- Run **`bundle exec rails test`** after backend changes.
- **Sanity-check the UI** for CRUD and insights after frontend changes.
- Prefer **clear SQL aggregates** over loading large collections into Ruby for insights.

## What was *not* delegated blindly

- **Data rules** (country list, salary positivity, email uniqueness) were reviewed for HR plausibility.
- **Security-sensitive defaults** (e.g. API validation, SQL aggregation instead of loading huge sets into memory) were reviewed before merge.
