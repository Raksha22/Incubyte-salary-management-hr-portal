# Salary Management Assessment (Rails + React)

This project is a local-first salary management tool for an HR manager.

It includes:
- Employee CRUD via UI
- Salary insights by country and job title
- Fast bulk seeding for 10,000 employees
- Tests for model, API, insights, and seeding logic

## Tech stack
- Ruby `3.0.2`
- Rails `7.1`
- SQLite
- React `18` (via Vite)
- Tailwind CSS `3`

## 1) Local setup (no Docker)

From the project directory:

```bash
bundle config set --local path 'vendor/bundle'
bundle config set --local build.sqlite3 --enable-system-libraries
bundle install
npm install
bundle exec rails db:prepare
```

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

## Notes
- `db/data/first_names.txt` and `db/data/last_names.txt` are used to generate names.
- Bulk seeding uses batched `insert_all!` for performance.
