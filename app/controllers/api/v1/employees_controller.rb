module Api
  module V1
    class EmployeesController < BaseController
      before_action :set_employee, only: %i[show update destroy]

      def index
        page = params.fetch(:page, 1).to_i.clamp(1, 1_000_000)
        per = params.fetch(:per, 25).to_i.clamp(1, 100)
        scope = Employee.order(created_at: :desc)
        scope = scope.where(country: params[:country]) if params[:country].present?
        if params[:q].present?
          term = "%#{ActiveRecord::Base.sanitize_sql_like(params[:q].strip)}%"
          scope = scope.where(
            "LOWER(first_name) LIKE :t OR LOWER(last_name) LIKE :t OR LOWER(email) LIKE :t OR LOWER(job_title) LIKE :t",
            t: term.downcase
          )
        end
        total = scope.count
        rows = scope.offset((page - 1) * per).limit(per)
        response.set_header("X-Total-Count", total.to_s)
        render json: rows.map(&:as_api_json)
      end

      def show
        render json: @employee.as_api_json
      end

      def create
        employee = Employee.new(employee_params)
        if employee.save
          render json: employee.as_api_json, status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @employee.update(employee_params)
          render json: @employee.as_api_json
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @employee.destroy!
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(
          :first_name,
          :last_name,
          :job_title,
          :country,
          :currency,
          :annual_salary,
          :email,
          :department
        )
      end
    end
  end
end
