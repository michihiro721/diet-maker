class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  # Google OAuth2のコールバック処理
  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    begin
      # OmniAuth Auth情報を取得
      auth_hash = request.env['omniauth.auth']
      Rails.logger.info "OmniAuth auth data available: #{auth_hash.present?}"
      
      if auth_hash.nil?
        Rails.logger.error "Missing omniauth.auth data - this is a critical error"
        Rails.logger.info "Request env keys: #{request.env.keys.select { |k| k.to_s.include?('omniauth') }}"
        Rails.logger.info "Request params: #{params.inspect}"
        
        if params['code'].present?
          auth_code = params['code']
          Rails.logger.info "Auth code received but could not process it: #{auth_code}"
        end
        
        # 認証失敗としてログインページにリダイレクト
        redirect_to_error("authentication_failed")
        return
      end
      
      # 認証データ詳細のログ
      Rails.logger.info "Auth provider: #{auth_hash.provider}"
      Rails.logger.info "Auth UID: #{auth_hash.uid}"
      Rails.logger.info "Auth email: #{auth_hash.info.email}"
      Rails.logger.info "Auth name: #{auth_hash.info.name}"
      
      # ユーザーを検索または作成
      @user = User.from_omniauth(auth_hash)
      
      if @user
        Rails.logger.info "User from omniauth: ID=#{@user.id}, email=#{@user.email}"
      else
        Rails.logger.error "Failed to create or find user from omniauth"
      end
      
      # フロントエンドのURLを取得
      frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker.jp'
      
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
        redirect_to_error("authentication_failed")
      end
    rescue => e
      Rails.logger.error "Error in OAuth callback: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      redirect_to_error(e.message)
    end
  end

  def failure
    Rails.logger.error "OAuth failure: #{request.env['omniauth.error']&.inspect}"
    redirect_to_error("oauth_failure")
  end

  def passthru
    Rails.logger.info "OAuth passthru called"
    render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
  end

  private
  
  # JWTトークンを生成
  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      exp: (Time.now + 24.hours).to_i,
      email: user.email,
      jti: SecureRandom.uuid
    }
    
    JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'])
  end
  
  # エラー時のリダイレクト
  def redirect_to_error(error_message)
    frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker.jp'
    redirect_to "#{frontend_url}/login?error=#{CGI.escape(error_message)}", allow_other_host: true
  end
end