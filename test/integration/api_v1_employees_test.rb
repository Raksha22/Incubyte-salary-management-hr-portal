require "test_helper"

class ApiV1EmployeesTest < ActionDispatch::IntegrationTest
  setup do
    Employee.delete_all

    @employee = Employee.create!(
      first_name: "Jamie",
      last_name: "Nguyen",
      job_title: "Data Analyst",
      country: "Canada",
      currency: "USD",
      annual_salary: 78_000,
      email: "jamie.nguyen@example.com",
      department: "Finance"
    )
  end

  test "index returns employees and total header" do
    get "/api/v1/employees", as: :json
    assert_response :success
    assert_equal 1, response.parsed_body.size
    assert response.headers["X-Total-Count"].present?
  end

  test "create and update" do
    assert_difference -> { Employee.count }, +1 do
      post "/api/v1/employees",
           params: {
             employee: {
               first_name: "Riley",
               last_name: "Chen",
               job_title: "Designer",
               country: "United States",
               currency: "USD",
               annual_salary: 92_000,
               email: "riley.chen@example.com",
               department: "Product",
             },
           },
           as: :json
    end
    assert_response :created
    id = response.parsed_body["id"]

    patch "/api/v1/employees/#{id}",
          params: { employee: { job_title: "Senior Designer", annual_salary: 98_000 } },
          as: :json
    assert_response :success
    assert_equal "Senior Designer", response.parsed_body["job_title"]
  end

  test "destroy" do
    assert_difference -> { Employee.count }, -1 do
      delete "/api/v1/employees/#{@employee.id}", as: :json
    end
    assert_response :no_content
  end
end
