class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # Google OAuthからのコールバック処理
  def google_oauth2
    # Google認証情報を使ってユーザーを取得または作成
    @user = User.from_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      # ユーザーが存在する場合はログイン処理
      token = generate_jwt_token(@user)
      
      # フロントエンドにリダイレクト（JWTトークンをURLパラメータとして渡す）
      redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/oauth/callback?token=#{token}"
    else
      # ユーザー作成に失敗した場合
      session['devise.google_data'] = request.env['omniauth.auth'].except('extra')
      redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/login", alert: '認証に失敗しました'
    end
  end

  # 認証失敗時の処理
  def failure
    redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/login", alert: '認証に失敗しました'
  end

  private

  # JWT トークンを生成
  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      exp: (Time.now + (ENV['DEVISE_JWT_EXPIRATION_TIME'].to_i || 24).hours).to_i
    }
    
    JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'])
  end
end