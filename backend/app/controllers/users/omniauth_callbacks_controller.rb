class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # CSRFトークン検証をスキップ（必ず含める）
  skip_before_action :verify_authenticity_token, raise: false

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      # 一時的に直接ログインの実装に変更
      sign_in @user
      # リダイレクト先を確実にフロントエンドに設定
      redirect_to 'https://diet-maker-mu.vercel.app', allow_other_host: true
    else
      session["devise.google_data"] = request.env["omniauth.auth"].except(:extra)
      redirect_to new_user_registration_url
    end
  end

  def failure
    redirect_to root_path
  end
end