Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "/favicon.ico", to: redirect("/path/to/your/favicon.ico")

  root "home#index"
  
  # フロントエンドの静的ファイルを提供
  get '*path', to: 'home#index', constraints: ->(request) { !request.xhr? && request.format.html? }

  # APIエンドポイント
  namespace :api do
    namespace :v1 do
      resources :your_resources
    end
  end
end
