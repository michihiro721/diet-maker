class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :verify_authenticity_token, raise: false

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    Rails.logger.info "Request params: #{params.inspect}"
    
    begin
      @user = User.from_omniauth(request.env["omniauth.auth"])

      if @user.persisted?
        # JWTトークンを生成
        token = generate_jwt_token(@user)
        
        # フロントエンドにリダイレクト
        redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/oauth/callback?token=#{token}&user_id=#{@user.id}"
      else
        session["devise.google_data"] = request.env["omniauth.auth"].except(:extra)
        redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/login"
      end
    rescue => e
      Rails.logger.error "Error in Google OAuth callback: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/login"
    end
  end

  def failure
    Rails.logger.error "OAuth failure: #{request.env['omniauth.error']&.inspect}"
    redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/login"
  end

  private

  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      exp: (Time.now + 24.hours).to_i
    }
    
    JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'])
  end
end