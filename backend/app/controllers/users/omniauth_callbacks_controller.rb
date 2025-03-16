class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # CSRFトークン検証を無効化
  skip_before_action :verify_authenticity_token, raise: false

  # パススルーメソッドを修正
  def passthru
    # Googleの認証ページに直接リダイレクト
    redirect_to "https://accounts.google.com/o/oauth2/auth?" + {
      client_id: ENV['GOOGLE_CLIENT_ID'],
      redirect_uri: "#{request.base_url}/users/auth/google_oauth2/callback",
      response_type: 'code',
      scope: 'email profile',
      prompt: 'select_account'
    }.to_query
  end

  def google_oauth2
    Rails.logger.info "Google OAuth callback received"
    
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: "Google") if is_navigational_format?
    else
      session["devise.google_data"] = request.env["omniauth.auth"].except(:extra)
      redirect_to new_user_registration_url
    end
  end

  def failure
    redirect_to root_path
  end
end