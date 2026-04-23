module Api
  module V1
    class SalaryInsightsController < BaseController
      def show
        country = params[:country].to_s.strip
        if country.blank?
          render json: { errors: ["country is required"] }, status: :bad_request
          return
        end
        unless Employee::COUNTRIES.include?(country)
          render json: { errors: ["unknown country"] }, status: :unprocessable_entity
          return
        end

        job_title = params[:job_title].presence
        render json: SalaryInsights.for_country(country: country, job_title: job_title)
      end
    end
  end
end
