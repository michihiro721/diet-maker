Rails.application.routes.draw do
  root 'home#index'  # ルートパスをhomeコントローラーのindexアクションに設定
  get "up" => "rails/health#show", as: :rails_health_check
end
