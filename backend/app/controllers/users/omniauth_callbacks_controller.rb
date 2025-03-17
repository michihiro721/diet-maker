class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # Google OAuth2 コールバック処理
  def google_oauth2
    @user = User.from_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      # JWTトークンを生成
      token = generate_jwt_token(@user)
      
      # フロントエンドにリダイレクト
      redirect_to "https://diet-maker-mu.vercel.app/oauth/callback?token=#{token}&user_id=#{@user.id}"
    else
      session['devise.google_data'] = request.env['omniauth.auth'].except('extra')
      redirect_to "https://diet-maker-mu.vercel.app/login", alert: 'ログインに失敗しました'
    end
  end

  # 認証失敗時
  def failure
    redirect_to "https://diet-maker-mu.vercel.app/login", alert: 'ログイン認証に失敗しました'
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