class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    begin
      # リクエストのAuth情報のデバッグ出力
      Rails.logger.info "Request env: #{request.env.keys}"
      Rails.logger.info "OmniAuth auth data available: #{request.env['omniauth.auth'].present?}"
      
      if request.env['omniauth.auth'].nil?
        # OmniAuthの認証情報がない場合はエラーを返す
        Rails.logger.error "No OAuth data available"
        frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
        redirect_to "#{frontend_url}/login?error=no_oauth_data", allow_other_host: true
        return
      else
        # 通常のOmniAuth処理
        @user = User.from_omniauth(request.env['omniauth.auth'])
      end
      
      # フロントエンドのURLを取得
      frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
      
      if @user && @user.persisted?
        Rails.logger.info "User authenticated: #{@user.email}, ID: #{@user.id}"
        
        # JWTトークンを生成
        token = generate_jwt_token(@user)
        
        # フロントエンドにリダイレクト
        redirect_url = "#{frontend_url}/oauth/callback?token=#{token}&user_id=#{@user.id}"
        Rails.logger.info "Redirecting to: #{redirect_url}"
        redirect_to redirect_url, allow_other_host: true
      else
        # ユーザー作成に失敗した場合
        Rails.logger.error "Failed to authenticate user"
        redirect_to "#{frontend_url}/login?error=authentication_failed", allow_other_host: true
      end
    rescue => e
      Rails.logger.error "Error in OAuth callback: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
      redirect_to "#{frontend_url}/login?error=#{CGI.escape(e.message)}", allow_other_host: true
    end
  end

  def failure
    Rails.logger.error "OAuth failure: #{request.env['omniauth.error']&.inspect}"
    frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
    redirect_to "#{frontend_url}/login?error=oauth_failure", allow_other_host: true
  end

  private
  
  # JWTトークンを生成
  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      exp: (Time.now + 24.hours).to_i
    }
    
    JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'])
  end
end