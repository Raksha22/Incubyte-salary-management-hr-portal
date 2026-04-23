# Salary Management Assessment (Rails + React)

This project is a local-first salary management tool for an HR manager.

It includes:

- Employee CRUD via UI
- Salary insights by country and job title
- Fast bulk seeding for 10,000 employees
- Tests for model, API, insights, and seeding logic
- **[Assessment artifacts](./artifacts/README.md)** (architecture, trade-offs, AI workflow)

## Tech stack

- Ruby `3.0.2`
- Rails `7.1`
- SQLite
- React `18` (via Vite)
- Tailwind CSS `3`

## 1) Local setup (no Docker)

From the project directory:

```bash
ruby -v
which ruby
which bundle
bundle -v

# Important: use ONE Ruby for everything (rbenv OR apt/system), not a mix.
# If `which ruby` is `/usr/bin/ruby` but you installed gems while rbenv was active
# (or vice versa), native extensions like `stringio` can fail with:
# "incompatible library version ... stringio.so"
#
# Quick sanity checks:
# - `ruby -e 'puts Gem.ruby'` should match the Ruby you used for `bundle install`
# - prefer rbenv shims: `which ruby` should be under `~/.rbenv/shims` when using rbenv

# This repo's Gemfile.lock is generated with Bundler 2.5.x (see `BUNDLED WITH`).
# If your `bundle -v` is older (for example 2.2.x), upgrade bundler first:
gem install bundler -v 2.5.23

bundle config set --local path 'vendor/bundle'
bundle config set --local build.sqlite3 --enable-system-libraries
bundle install
npm install
bundle exec rails db:prepare
```

### Troubleshooting

#### A) You see `Debug.rb` and a `(rdb:1)` prompt

That is **Ruby’s legacy debugger**, not Rails.

Most common causes:

- `RUBYOPT` contains `-rdebug` / `-r debug` / `-d`
- **Bundler** has a persisted `ruby` / `rubyopt` setting that injects debug flags

Check Bundler settings:

```bash
bundle config list
```

If you see anything suspicious (especially around `ruby` / `rubyopt` / `RUBYOPT`), remove it, for example:

```bash
bundle config unset ruby
bundle config unset rubyopt
```

Also check your user-level Bundler config:

```bash
cat ~/.bundle/config
```

#### B) Bootsnap error: `incompatible library version ... bootsnap.so`

This almost always means **`vendor/bundle` was compiled with a different Ruby** than the one you are running now (common after switching rbenv versions, or mixing `/usr/bin/ruby` with rbenv).

Fix by rebuilding gems for the Ruby you are actually using:

```bash
rm -rf vendor/bundle
bundle install
```

#### C) `prism` native extension fails to compile during `bundle install`

Newer `irb` releases depend on the `prism` gem, which can fail to compile on some Ruby 3.0.2 environments.

This repo pins `irb` to `1.16.0` to avoid pulling `prism`. If you still hit this after pulling changes, run:

```bash
bundle lock
rm -rf vendor/bundle
bundle install
```

#### D) `Gem::LoadError` about `tsort` default gem (activated 0.1.0 vs required 0.2.0)

This is a known sharp edge on **Ruby 3.0.2 + Rubygems 3.2.x**: the default activated `tsort` is often **`0.1.0`**, while **`rdoc 7.x` pulls `tsort 0.2.0` as a gem dependency**, which can trigger:

> already activated tsort 0.1.0, but your Gemfile requires tsort 0.2.0

This repo avoids that by pinning:

- `rdoc` to **`6.6.3.1`** (does not depend on `tsort`)
- `irb` to **`1.16.0`** (avoids the `prism` native extension required by newer IRB)

After pulling those Gemfile changes:

```bash
rm -rf vendor/bundle
bundle install
```

Optional (if you prefer upgrading tooling instead of pinning gems): update RubyGems / Ruby patch version so default gems line up with modern Bundler resolutions.

## 2) Seed data

### Small sample seed (quick check)

```bash
bundle exec rails db:seed
```

### Fast 10,000 employee seed

```bash
bundle exec rails employees:seed_bulk
```

Optional custom count:

```bash
COUNT=20000 bundle exec rails employees:seed_bulk
```

## 3) Run the project locally

Start both Rails and Vite:

```bash
bin/dev
```

Then open:

```text
http://localhost:3000
```

## 4) Rails console

```bash
bundle exec rails console
```

Example checks inside console:

```ruby
Employee.count
Employee.group(:country).count
SalaryInsights.for_country(country: "United States")
```

## 5) Run tests

```bash
bundle exec rails test
```

## 6) API quick checks (manual)

```bash
curl "http://localhost:3000/api/v1/employees?page=1&per=5"
curl "http://localhost:3000/api/v1/salary_insights?country=United%20States"
curl "http://localhost:3000/api/v1/salary_insights?country=United%20States&job_title=Software%20Engineer"
```

## 7) Demo video

Screen recording of the running app (CRUD, filters, salary insights):  
**[Incubyte assessment demo (Google Drive)](https://drive.google.com/file/d/1q60dAwyh0g2qo06TY3o214x6smed6P8I/view?usp=sharing)**

Reviewers can run the app locally with sections 1–3 above after cloning from Git.

## 8) Push this repo to GitHub (or GitLab)

From the project root, after your changes are committed:

```bash
git status
git add -A
git commit -m "Your message if you still have uncommitted changes"
```

Add a remote (once) using your real URL:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
```

If `origin` already exists but points elsewhere, use `git remote set-url origin https://github.com/YOUR_USER/YOUR_REPO.git` instead.

Push the current branch (named `main` here):

```bash
git branch
git push -u origin main
```

If the hosting site shows an empty repo with different default branch instructions, follow that page (for example `git push -u origin main:main`). Authenticate with SSH (`git@github.com:...`) or HTTPS using a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) where a password would normally be used.

## Notes

- `db/data/first_names.txt` and `db/data/last_names.txt` are used to generate names.
- Bulk seeding uses batched `insert_all!` for performance.
