module Employees
  class BulkSeeder
    DEFAULT_COUNT = 10_000
    BATCH_SIZE = 1_000

    JOB_TITLES = [
      "Software Engineer",
      "Senior Software Engineer",
      "Engineering Manager",
      "HR Business Partner",
      "Product Manager",
      "Product Designer",
      "Data Analyst",
      "Sales Representative",
      "Account Executive",
      "Financial Analyst",
      "Operations Specialist",
      "Customer Success Manager",
      "IT Support Engineer",
      "Recruiter",
      "Marketing Manager"
    ].freeze

    DEPARTMENTS = %w[Engineering People Product Sales Finance Operations].freeze

    class << self
      def call(count: DEFAULT_COUNT, random: Random.new(42))
        first_names = read_lines(Rails.root.join("db/data/first_names.txt"))
        last_names = read_lines(Rails.root.join("db/data/last_names.txt"))
        raise "db/data/first_names.txt is missing or empty" if first_names.empty?
        raise "db/data/last_names.txt is missing or empty" if last_names.empty?

        Employee.delete_all
        now = Time.current
        rows = []
        inserted = 0

        count.times do |i|
          first_name = first_names[random.rand(first_names.length)]
          last_name = last_names[random.rand(last_names.length)]
          country = Employee::COUNTRIES[random.rand(Employee::COUNTRIES.length)]
          job_title = JOB_TITLES[random.rand(JOB_TITLES.length)]
          salary = random.rand(32_000.0..240_000.0).round(2)
          currency = country == "United Kingdom" ? "GBP" : "USD"
          department = DEPARTMENTS[random.rand(DEPARTMENTS.length)]

          rows << {
            first_name: first_name,
            last_name: last_name,
            job_title: job_title,
            country: country,
            currency: currency,
            annual_salary: salary,
            email: unique_email(i, random),
            department: department,
            created_at: now,
            updated_at: now
          }

          next unless rows.length >= BATCH_SIZE

          Employee.insert_all!(rows)
          inserted += rows.length
          rows.clear
        end

        if rows.any?
          Employee.insert_all!(rows)
          inserted += rows.length
        end

        inserted
      end

      private

      def read_lines(path)
        File.readlines(path).map(&:strip).reject(&:empty?)
      end

      def unique_email(index, random)
        "employee.#{index}.#{random.rand(1_000_000)}@seed.local"
      end
    end
  end
end
