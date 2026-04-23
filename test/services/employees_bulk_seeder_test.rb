require "test_helper"

class EmployeesBulkSeederTest < ActiveSupport::TestCase
  test "inserts requested rows using name files" do
    inserted = Employees::BulkSeeder.call(count: 120, random: Random.new(7))
    assert_equal 120, inserted
    assert_equal 120, Employee.count

    e0 = Employee.order(:id).first
    assert e0.email.end_with?("@seed.local")
    assert e0.first_name.present?
    assert e0.last_name.present?
    assert e0.annual_salary.positive?
  end
end
