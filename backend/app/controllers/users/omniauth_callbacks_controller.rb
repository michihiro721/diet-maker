class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  skip_forgery_protection only: [:google_oauth2]

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

  # パススルーメソッドを追加
  def passthru
    render status: 404, plain: "Not found. Authentication passthru."
  end
end