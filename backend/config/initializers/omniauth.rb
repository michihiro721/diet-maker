Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'], {
    scope: 'email,profile',
    prompt: 'select_account',
    # コールバックURLは環境によって動的に変更
    redirect_uri: proc { |env| 
      host = env['HTTP_HOST']
      if host.include?('localhost')
        "http://localhost:3000/users/auth/google_oauth2/callback"
      else
        ENV['GOOGLE_CALLBACK_URL'] || "https://diet-maker-d07eb3099e56.herokuapp.com/users/auth/google_oauth2/callback"
      end
    },
    access_type: 'offline'
  }
end

# CSRFトークンの保護を無効化
OmniAuth.config.allowed_request_methods = [:post, :get]
OmniAuth.config.silence_get_warning = true