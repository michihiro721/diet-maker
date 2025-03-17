# backend/config/routes.rb
Rails.application.routes.draw do
  # Deviseルート設定
  devise_for :users,
    controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      passwords: 'users/passwords',
      omniauth_callbacks: 'users/omniauth_callbacks'
    },
    path: 'auth',
    path_names: {
      sign_in: 'sign_in',
      sign_out: 'sign_out',
      registration: 'sign_up'
    }

  # 既存のdevise_scopeを修正
  devise_scope :user do
    post '/auth/validate_reset_token', to: 'users/passwords#validate_token'
    get '/auth/google', to: redirect('/auth/google_oauth2')
    # セッション関連のカスタムルート
    post '/auth/sign_in', to: 'users/sessions#create'
    delete '/auth/sign_out', to: 'users/sessions#destroy'
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

  # カスタムエンドポイント：認証済みユーザー情報取得
  get '/users/me', to: 'users#show'

  get '*path', to: 'home#index', constraints: ->(request) {
    !request.xhr? && 
    request.format.html? && 
    !request.path.start_with?('/cable', '/api') && 
    !request.path.include?('/auth/') && 
    !request.path.include?('/users/auth/')
  }

  root "home#index"
end