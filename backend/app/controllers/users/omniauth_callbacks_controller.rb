class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # CSRFトークン検証を無効化
  skip_before_action :verify_authenticity_token, raise: false

  def passthru
    Rails.logger.info "Passthru called - これが呼ばれるべきではない"
    super
  end

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      # JWTトークンを生成
      token = JWT.encode(
        { sub: @user.id, exp: (Time.now + 24.hours).to_i },
        ENV['DEVISE_JWT_SECRET_KEY'],
        'HS256'
      )
      
      # フロントエンドのURL
      frontend_url = 'https://diet-maker-mu.vercel.app'
      
      # パラメータにトークンとユーザーIDを追加してリダイレクト
      redirect_to "#{frontend_url}/auth/callback?token=#{token}&user_id=#{@user.id}"
    else
      session["devise.google_data"] = request.env["omniauth.auth"].except(:extra)
      redirect_to new_user_registration_url
    end
  end

  def failure
    redirect_to root_path
  end
end