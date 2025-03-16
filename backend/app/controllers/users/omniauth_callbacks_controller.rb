class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # CSRF保護を無効化
  protect_from_forgery with: :null_session, only: [:google_oauth2]
  skip_before_action :verify_authenticity_token, only: [:google_oauth2]

  def google_oauth2
    # デバッグログを追加
    Rails.logger.info "Google OAuth callback received with auth: #{request.env['omniauth.auth']&.uid}"
    
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      # JWT形式のトークンを生成
      token = JWT.encode(
        { sub: @user.id, exp: 24.hours.from_now.to_i },
        ENV['DEVISE_JWT_SECRET_KEY']
      )
      
      # フロントエンドのURLへリダイレクト
      redirect_url = "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/auth/callback?token=#{token}"
      Rails.logger.info "Redirecting to: #{redirect_url}"
      redirect_to redirect_url
    else
      # 登録失敗の場合
      session["devise.google_data"] = request.env["omniauth.auth"].except(:extra)
      redirect_to new_user_registration_url
    end
  end

  def failure
    Rails.logger.error "Authentication failure: #{params[:message]}"
    redirect_to root_path
  end
end