Rails.application.routes.draw do
  devise_for :users, path: 'auth', controllers: {
  sessions: 'users/sessions',
  registrations: 'users/registrations'
}

  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # Favicon設定
  get "/favicon.ico", to: redirect("/path/to/your/favicon.ico")

  # WebSocket用のルートを設定
  mount ActionCable.server => '/cable'

  # APIエンドポイント
  resources :weights, only: [:index, :create]
  resources :goals, only: [:show, :create, :update, :destroy] do
    collection do
      get 'latest'
    end
  end
  resources :trainings, only: [:index, :create]
  resources :workouts, only: [:index]
  resources :daily_calories, only: [:index, :create]
  resources :steps, only: [:index, :create]
  resources :intake_calories, only: [:index, :create]

  # フロントエンドの静的ファイルを提供 (ただし、/cable, /api には適用しない)
  get '*path', to: 'home#index', constraints: ->(request) {
    !request.xhr? && request.format.html? && !request.path.start_with?('/cable', '/api')
  }

  # ルートパスを設定
  root "home#index"
end