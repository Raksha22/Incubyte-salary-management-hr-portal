# Trade-offs and performance

## SQLite

**Choice:** SQLite for all environments.

**Why:** Matches the assessment brief, zero external services, and trivial local setup for reviewers.

**Trade-off:** Not ideal for multi-instance production writes. For a long-lived public deploy with horizontal scaling, PostgreSQL (or another server RDBMS) would be the next step; the schema is small and migration would be straightforward.

## Bulk seeding

**Choice:** `delete_all` then batched `insert_all!` with deterministic `Random.new(42)` for reproducible demos.

**Why:** Engineers are expected to run the seed often; ORM row-by-row inserts would be unnecessarily slow for 10,000 rows.

**Trade-off:** Full table wipe is aggressive; acceptable for a demo dataset, not for shared production data.

## Salary insights API

**Choice:** One request returns country-wide stats, optional job-title slice, and a **top 20** job-title breakdown.

**Why:** Fewer round trips for the HR persona; SQL aggregates keep work in the database; the breakdown cap avoids huge payloads when many distinct titles exist.

**Trade-off:** Job title filter uses **exact string match** (documented in the UI) to keep semantics clear; fuzzy matching would need product rules and heavier queries.

## Email immutability on edit

**Choice:** In the UI, email is disabled when editing (treated as a stable identifier for this demo).

**Why:** Reduces accidental uniqueness violations and keeps the edit flow simple.

**Trade-off:** Real HR systems often allow controlled email changes with verification.

## React + Tailwind vs a component library

**Choice:** Tailwind for layout and visuals instead of MUI/Chakra/etc.

**Why:** Fast iteration, small bundle, and no lock-in to a specific component API for an assessment-sized UI.

**Trade-off:** Less out-of-the-box accessibility polish than mature libraries; mitigated by semantic HTML and native controls where possible.
