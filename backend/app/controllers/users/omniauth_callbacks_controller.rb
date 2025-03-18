class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  # Google OAuth2のコールバック処理
  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    begin
      # OmniAuth Auth情報を取得
      Rails.logger.info "OmniAuth auth data available: #{request.env['omniauth.auth'].present?}"
      
      # OmniAuthから認証情報を取得できない場合
      if request.env['omniauth.auth'].nil?
        # OmniAuthが設定されていないか、エラーがある場合
        # 追加のデバッグ情報を記録
        Rails.logger.error "Missing omniauth.auth - trying to extract information from auth code"
        
        # Googleから取得したコードを使用
        if params['code'].present?
          auth_code = params['code']
          Rails.logger.info "Auth code received: #{auth_code}"

          # Google APIからトークンとプロファイル情報を取得（本来はこちらを実装すべき）
          # 今回はログを残す実装に変更
          Rails.logger.error "Cannot automatically detect Google account from code. Redirecting to login page."
          redirect_to_error("google_auth_failed")
          return
        else
          # コードもない場合はエラー
          error_msg = "No OAuth data or code available"
          Rails.logger.error error_msg
          redirect_to_error(error_msg)
          return
        end
      else
        # 通常のOmniAuth処理 - request.env['omniauth.auth']が利用可能な場合
        auth_data = request.env['omniauth.auth']
        Rails.logger.info "Processing OmniAuth data: #{auth_data.provider}, #{auth_data.uid}, #{auth_data.info.email}"
        
        @user = User.from_omniauth(auth_data)
        
        if @user
          Rails.logger.info "User from omniauth: ID=#{@user.id}, email=#{@user.email}"
        else
          Rails.logger.error "Failed to create or find user from omniauth"
        end
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

  private
  
  # JWTトークンを生成
  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      exp: (Time.now + 24.hours).to_i,
      email: user.email, # 追加のクレーム
      jti: SecureRandom.uuid # 一意のトークンID
    }
    
    JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'])
  end
  
  # エラー時のリダイレクト
  def redirect_to_error(error_message)
    frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
    redirect_to "#{frontend_url}/login?error=#{CGI.escape(error_message)}", allow_other_host: true
  end
end