class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # CSRFトークン検証を無効化
  skip_before_action :verify_authenticity_token, raise: false

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    # OmniAuthからユーザー情報を取得
    auth = request.env["omniauth.auth"]
    Rails.logger.info "Auth data: #{auth.to_json}"
    
    @user = User.from_omniauth(auth)

    # フロントエンドのURLを取得
    frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
    
    if @user.persisted?
      Rails.logger.info "User found/created successfully: #{@user.id}"
      
      # JWTトークンを生成
      token = generate_jwt_token(@user)
      
      # フロントエンドにリダイレクト（SPAモード）
      redirect_to "#{frontend_url}/oauth/callback?token=#{token}&user_id=#{@user.id}", allow_other_host: true
    else
      Rails.logger.error "Failed to persist user: #{@user.errors.full_messages}"
      # ユーザー作成に失敗した場合はエラーと共にリダイレクト
      redirect_to "#{frontend_url}/login?error=failed_to_create_user", allow_other_host: true
    end
  end

  def failure
    Rails.logger.error "OAuth failure: #{request.env['omniauth.error']&.inspect}"
    
    # エラー時のリダイレクト先
    frontend_url = ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'
    redirect_to "#{frontend_url}/login?error=oauth_failure", allow_other_host: true
  end

  private
  
  # JWTトークンを生成するメソッド
  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      exp: (Time.now + 24.hours).to_i
    }
    
    JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'])
  end
end