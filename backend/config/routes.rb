Rails.application.routes.draw do
  devise_for :users, 
    path: 'auth', 
    defaults: { format: :json },
    controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      passwords: 'users/passwords',
      omniauth_callbacks: 'users/omniauth_callbacks'
    }

  # OmniAuth用の明示的なルート
  get '/auth/google_oauth2', to: 'users/omniauth_callbacks#passthru'
  get '/auth/google_oauth2/callback', to: 'users/omniauth_callbacks#google_oauth2'

  # 既存のルート
  devise_scope :user do
    post '/auth/validate_reset_token', to: 'users/passwords#validate_token'
  end

  resources :users, only: [:show, :update]

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
  
  # トレーニング関連のルートを修正
  resources :trainings, only: [:index, :create] do
    collection do
      get 'monthly'
      get 'max_weights' # 追加: 最大重量を取得するエンドポイント
      delete 'destroy_by_date'
    end
  end
  
  resources :workouts, only: [:index]
  resources :daily_calories, only: [:index, :create]
  resources :steps, only: [:index, :create]
  resources :intake_calories, only: [:index, :create]

  # 投稿、コメント、いいね機能のルート
  resources :posts do
    resources :comments, only: [:create, :destroy]
    resources :likes, only: [:create]
  end

  # パスワードリセット用のルート（優先度高）
  get 'reset-password/:token', to: 'home#index'

  # フロントエンドの静的ファイルを提供 (ただし、/cable, /api, /auth には適用しない)
  get '*path', to: 'home#index', constraints: ->(request) {
    !request.xhr? && request.format.html? && !request.path.start_with?('/cable', '/api', '/auth')
  }

  # ルートパスを設定
  root "home#index"
end