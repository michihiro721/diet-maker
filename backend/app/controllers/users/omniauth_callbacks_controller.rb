class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    begin
      auth_hash = request.env["omniauth.auth"]

      if auth_hash.nil?
        redirect_to_error("authentication_failed")
        return
      end

      @user = User.from_omniauth(auth_hash)

      frontend_url = ENV["FRONTEND_URL"] || "https://diet-maker.jp"

      if @user && @user.persisted?
        token = generate_jwt_token(@user)

        redirect_url = "#{frontend_url}/oauth/callback?token=#{token}&user_id=#{@user.id}"
        redirect_to redirect_url, allow_other_host: true
      else
        redirect_to_error("authentication_failed")
      end
    rescue => e
      redirect_to_error(e.message)
    end
  end

  def failure
    redirect_to_error("oauth_failure")
  end

  def passthru
    render file: "#{Rails.root}/public/404.html", status: 404, layout: false
  end

  private

  def generate_jwt_token(user)
    payload = {
      sub: user.id,
      email: user.email,
      jti: SecureRandom.uuid
    }

    JWT.encode(payload, ENV["DEVISE_JWT_SECRET_KEY"])
  end

  def redirect_to_error(error_message)
    frontend_url = ENV["FRONTEND_URL"] || "https://diet-maker.jp"
    redirect_to "#{frontend_url}/login?error=#{CGI.escape(error_message)}", allow_other_host: true
  end
end
