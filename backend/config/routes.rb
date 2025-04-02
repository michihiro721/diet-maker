Rails.application.routes.draw do
  # Deviseルート - OmniAuth用の設定を追加
  devise_for :users,
    path: "auth",
    defaults: { format: :json },
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations",
      passwords: "users/passwords",
      omniauth_callbacks: "users/omniauth_callbacks"
    }

  # Google OAuth2のリダイレクト設定
  get "/users/auth/google_oauth2", to: redirect("/auth/google_oauth2")
  get "/users/auth/google_oauth2/callback", to: "users/omniauth_callbacks#google_oauth2"

  # ユーザー情報取得用のエンドポイント
  get "/users/show", to: "users#show"
  get "/users/:id", to: "users#show_by_id"

  # 既存APIルート
  resources :users, only: [ :show, :update ]

  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # Favicon設定
  get "/favicon.ico", to: redirect("/path/to/your/favicon.ico")

  # WebSocket用のルートを設定
  mount ActionCable.server => "/cable"

  # APIエンドポイント
  resources :weights, only: [ :index, :create ]
  resources :goals, only: [ :show, :create, :update, :destroy ] do
    collection do
      get "latest"
    end
  end

  # トレーニング関連のルート
  resources :trainings, only: [ :index, :create ] do
    collection do
      get "monthly"
      get "max_weights"
      delete "destroy_by_date"
    end
  end

  resources :workouts, only: [ :index ]
  resources :daily_calories, only: [ :index, :create ]
  resources :steps, only: [ :index, :create ]
  resources :intake_calories, only: [ :index, :create ]

  # 投稿、コメント、いいね機能のルート
  resources :posts do
    resources :comments, only: [ :create, :destroy ]
    resources :likes, only: [ :create ]
  end

  # パスワードリセット用のルート
  get "reset-password/:token", to: "home#index"

  get "*path", to: "home#index", constraints: ->(request) {
    !request.xhr? && request.format.html? &&
    !request.path.start_with?("/auth/", "/users/auth/", "/cable")
  }

  # ルートパスを設定
  root "home#index"
end
