class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  protect_from_forgery with: :null_session, only: [:google_oauth2, :passthru, :failure]

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    begin
      # OAuthデータからユーザーを取得または作成
      @user = User.from_omniauth(request.env["omniauth.auth"])
      
      # セッションから元のホスト情報を取得
      origin_url = session[:origin_url] || ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
      Rails.logger.info "Redirecting to origin: #{origin_url}"

      if @user.persisted?
        # JWTトークンを生成
        token = generate_jwt_token(@user)
        
        # フロントエンドにリダイレクト
        redirect_to "#{origin_url}/oauth/callback?token=#{token}&user_id=#{@user.id}", allow_other_host: true
      else
        # ユーザー作成に失敗した場合はログイン画面にリダイレクト
        session["devise.google_data"] = request.env["omniauth.auth"].except(:extra)
        redirect_to "#{origin_url}/login?error=google_auth_failed", allow_other_host: true
      end
    rescue => e
      Rails.logger.error "Error in Google OAuth callback: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      
      # エラー時もオリジンURLを使用
      origin_url = session[:origin_url] || ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
      redirect_to "#{origin_url}/login?error=#{e.message}", allow_other_host: true
    end
  end

  def failure
    Rails.logger.error "OAuth failure: #{request.env['omniauth.error']&.inspect}"
    
    # エラー時もオリジンURLを使用
    origin_url = session[:origin_url] || ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
    redirect_to "#{origin_url}/login?error=oauth_failure", allow_other_host: true
  end

  # 認証処理の開始ポイント
  def passthru
    Rails.logger.info "Passthru method called for provider: #{params[:provider]}"
    
    # オリジンURLをセッションに保存（リダイレクト後も参照できるように）
    session[:origin_url] = params[:origin] if params[:origin].present?
    Rails.logger.info "Origin URL set to: #{session[:origin_url]}"
    
    # 直接URLを構築してリダイレクト
    redirect_to "/users/auth/google_oauth2"
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