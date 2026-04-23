class Employee < ApplicationRecord
  COUNTRIES = %w[
    United\ States United\ Kingdom Canada Germany France India Japan Australia Brazil Mexico
    Netherlands Spain Italy Sweden Poland Singapore Ireland South\ Africa
  ].freeze

  validates :first_name, :last_name, :job_title, :country, :email, presence: true
  validates :annual_salary, numericality: { greater_than: 0 }
  validates :email, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :currency, presence: true
  validates :country, inclusion: { in: COUNTRIES }, allow_blank: false

  before_validation :normalize_email

  def full_name
    "#{first_name} #{last_name}".squish
  end

  def as_api_json
    {
      id: id,
      first_name: first_name,
      last_name: last_name,
      full_name: full_name,
      job_title: job_title,
      country: country,
      currency: currency,
      annual_salary: annual_salary.to_f,
      email: email,
      department: department,
      created_at: created_at&.iso8601,
      updated_at: updated_at&.iso8601
    }
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
