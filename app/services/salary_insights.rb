class SalaryInsights
  def self.for_country(country:, job_title: nil)
    base = Employee.where(country: country)
    overall = aggregate(base)
    filtered = job_title.present? ? aggregate(base.where(job_title: job_title)) : nil

    breakdown_rows = base.group(:job_title).order(Arel.sql("COUNT(*) DESC")).limit(20).pluck(
      Arel.sql("job_title"),
      Arel.sql("COUNT(*)"),
      Arel.sql("AVG(annual_salary)"),
      Arel.sql("MIN(annual_salary)"),
      Arel.sql("MAX(annual_salary)")
    )

    job_title_breakdown = breakdown_rows.map do |title, count, avg, min_s, max_s|
      {
        job_title: title,
        employee_count: count,
        avg_salary: avg&.to_f,
        min_salary: min_s&.to_f,
        max_salary: max_s&.to_f
      }
    end

    {
      country: country,
      overall: overall,
      filtered_by_job_title: filtered,
      job_title_breakdown: job_title_breakdown
    }
  end

  def self.aggregate(scope)
    count, min_s, max_s, avg_s, sum_s = scope.pick(
      Arel.sql("COUNT(*)"),
      Arel.sql("MIN(annual_salary)"),
      Arel.sql("MAX(annual_salary)"),
      Arel.sql("AVG(annual_salary)"),
      Arel.sql("SUM(annual_salary)")
    )

    {
      employee_count: count || 0,
      min_salary: min_s&.to_f,
      max_salary: max_s&.to_f,
      avg_salary: avg_s&.to_f,
      total_payroll: sum_s&.to_f
    }
  end
end
