Rails.application.routes.draw do
  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # Favicon設定
  get "/favicon.ico", to: redirect("/path/to/your/favicon.ico")

  # WebSocket用のルートを設定
  mount ActionCable.server => '/cable'

  # APIエンドポイント
  namespace :api do
    namespace :v1 do
      resources :your_resources
      resources :weights, only: [:index, :create] # 🔥 weightsのエンドポイントをAPI v1に追加
      resources :goals, only: [:show, :create, :update, :destroy] do
        collection do
          get 'latest'  # /api/v1/goals/latest でアクセスできるようにする
        end
      end
    end
  end

  # フロントエンドの静的ファイルを提供 (ただし、/cable, /api には適用しない)
  get '*path', to: 'home#index', constraints: ->(request) {
    !request.xhr? && request.format.html? && !request.path.start_with?('/cable', '/api')
  }

  # ルートパスを設定
  root "home#index"
end