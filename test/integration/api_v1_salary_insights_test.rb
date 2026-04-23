require "test_helper"

class ApiV1SalaryInsightsTest < ActionDispatch::IntegrationTest
  setup do
    Employee.delete_all

    Employee.create!(
      first_name: "A",
      last_name: "One",
      job_title: "Software Engineer",
      country: "United States",
      currency: "USD",
      annual_salary: 100_000,
      email: "a1@example.com"
    )
    Employee.create!(
      first_name: "B",
      last_name: "Two",
      job_title: "Software Engineer",
      country: "United States",
      currency: "USD",
      annual_salary: 120_000,
      email: "b2@example.com"
    )
    Employee.create!(
      first_name: "C",
      last_name: "Three",
      job_title: "Recruiter",
      country: "United States",
      currency: "USD",
      annual_salary: 90_000,
      email: "c3@example.com"
    )
  end

  test "requires country" do
    get "/api/v1/salary_insights", as: :json
    assert_response :bad_request
  end

  test "returns aggregates for country" do
    get "/api/v1/salary_insights", params: { country: "United States" }, as: :json
    assert_response :success
    body = response.parsed_body
    assert_equal 3, body["overall"]["employee_count"]
    assert_equal 90_000, body["overall"]["min_salary"]
    assert_equal 120_000, body["overall"]["max_salary"]
    assert_in_delta 103_333.33, body["overall"]["avg_salary"], 1.0
  end

  test "filters by job title" do
    get "/api/v1/salary_insights",
        params: { country: "United States", job_title: "Software Engineer" },
        as: :json
    assert_response :success
    body = response.parsed_body
    assert_equal 2, body["filtered_by_job_title"]["employee_count"]
    assert_in_delta 110_000, body["filtered_by_job_title"]["avg_salary"], 1.0
  end
end
