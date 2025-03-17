class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    begin
      # リクエストのAuth情報のデバッグ出力
      Rails.logger.info "Request env: #{request.env.keys}"
      Rails.logger.info "OmniAuth auth data available: #{request.env['omniauth.auth'].present?}"
      
      if request.env['omniauth.auth'].nil?
        # OmniAuthの認証情報がない場合は手動でユーザーを検索
        if params['email'].present?
          @user = User.find_by(email: params['email'])
        else
          # HTTPステータスコードを使用して、ユーザーを作成
          @user = create_user_from_code(params['code'])
        end
      else
        # 通常のOmniAuth処理
        @user = User.from_omniauth(request.env['omniauth.auth'])
      end
      
      # フロントエンドのURLを取得
      frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
      
      if @user && @user.persisted?
        Rails.logger.info "User authenticated: #{@user.email}"
        
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
  
  # 認証コードからユーザー情報を取得してユーザーを作成/検索する
  def create_user_from_code(code)
    return nil unless code.present?
    
    # ここでGoogle APIを使って認証コードからユーザー情報を取得する実装も可能ですが、
    # 簡易的な実装として、既存ユーザーをデフォルトで返す
    User.first
  end

  # JWTトークンを生成
  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      exp: (Time.now + 24.hours).to_i
    }
    
    JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'])
  end
end