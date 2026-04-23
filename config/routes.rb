Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"

  namespace :api do
    namespace :v1 do
      resources :employees
      get "salary_insights", to: "salary_insights#show"
    end
  end
end
