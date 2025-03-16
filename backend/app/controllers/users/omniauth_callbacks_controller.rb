class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  protect_from_forgery with: :null_session

  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      # JWTトークンを生成
      token = JWT.encode(
        { sub: @user.id, exp: (ENV['DEVISE_JWT_EXPIRATION_TIME'] || 24).to_i.hours.from_now.to_i },
        ENV['DEVISE_JWT_SECRET_KEY']
      )
      
      # フロントエンドにリダイレクト（トークン付き）
      redirect_to "#{ENV['FRONTEND_URL'] || 'http://localhost:8000'}/auth/callback?token=#{token}"
    else
      # 登録失敗の場合
      redirect_to "#{ENV['FRONTEND_URL'] || 'http://localhost:8000'}/login?error=auth_failed"
    end
  end

  def failure
    redirect_to "#{ENV['FRONTEND_URL'] || 'http://localhost:8000'}/login?error=#{params[:message]}"
  end
end