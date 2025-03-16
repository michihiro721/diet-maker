class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # パススルーメソッドを追加
  def passthru
    # OmniAuthにリクエストを渡す
    render status: 404, plain: "Not found. Authentication passthru."
  end

  def google_oauth2
    # ログを追加して、デバッグしやすくする
    Rails.logger.info "OmniAuth callback triggered for Google: #{request.env['omniauth.auth']}"

    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      # JWTトークンを生成
      token = JWT.encode(
        { sub: @user.id, exp: 24.hours.from_now.to_i },
        ENV['DEVISE_JWT_SECRET_KEY']
      )
      
      # フロントエンドにリダイレクト（トークン付き）
      redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/auth/callback?token=#{token}"
    else
      # 登録失敗の場合
      redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/login?error=auth_failed"
    end
  end

  def failure
    redirect_to "#{ENV['FRONTEND_URL'] || 'https://diet-maker-mu.vercel.app'}/login?error=#{params[:message]}"
  end
end