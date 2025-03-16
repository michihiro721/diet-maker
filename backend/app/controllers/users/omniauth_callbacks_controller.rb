# backend/app/controllers/users/omniauth_callbacks_controller.rb
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # CSRFトークン検証を無効化
  skip_before_action :verify_authenticity_token, raise: false

  def passthru
    Rails.logger.info "Passthru called - これが呼ばれるべきではない"
    super
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