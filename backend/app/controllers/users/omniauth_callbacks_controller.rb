# backend/app/controllers/users/omniauth_callbacks_controller.rb
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
      # JWTトークンを手動で生成
      payload = {
        sub: @user.id,
        exp: (Time.now + 24.hours).to_i
      }
      begin
        token = JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'], 'HS256')
        
        # フロントエンドのURL
        frontend_url = 'https://diet-maker-mu.vercel.app'
        
        # パラメータにトークンとユーザーIDを追加してリダイレクト
        redirect_to "#{frontend_url}/auth/callback?token=#{token}&user_id=#{@user.id}"
      rescue => e
        Rails.logger.error "JWT encoding error: #{e.message}"
        # Tokenの生成に失敗した場合も、フロントエンドにエラー情報を渡す
        redirect_to "#{frontend_url}/auth/callback?error=token_generation_failed&message=#{e.message}"
      end
    else
      session["devise.google_data"] = request.env["omniauth.auth"].except(:extra)
      redirect_to new_user_registration_url
    end
  end

  def failure
    Rails.logger.error "Authentication failure: #{params.inspect}"
    frontend_url = 'https://diet-maker-mu.vercel.app'
    redirect_to "#{frontend_url}/login?error=auth_failed"
  end
end