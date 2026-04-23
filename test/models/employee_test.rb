require "test_helper"

class EmployeeTest < ActiveSupport::TestCase
  test "valid employee" do
    e = Employee.new(
      first_name: "Sam",
      last_name: "Rivera",
      job_title: "Software Engineer",
      country: "United States",
      currency: "USD",
      annual_salary: 120_000,
      email: "sam.rivera@example.com",
      department: "Engineering"
    )
    assert e.valid?
    assert_equal "Sam Rivera", e.full_name
  end

  test "requires positive salary" do
    e = Employee.new(
      first_name: "Sam",
      last_name: "Rivera",
      job_title: "Software Engineer",
      country: "United States",
      currency: "USD",
      annual_salary: 0,
      email: "sam2@example.com"
    )
    assert_not e.valid?
  end

  test "normalizes email" do
    e = Employee.create!(
      first_name: "Sam",
      last_name: "Rivera",
      job_title: "Software Engineer",
      country: "United States",
      currency: "USD",
      annual_salary: 80_000,
      email: "  MixedCase@Example.COM "
    )
    assert_equal "mixedcase@example.com", e.reload.email
  end
end
