OmniAuth.config.allowed_request_methods = [:post, :get]
OmniAuth.config.silence_get_warning = true

# リダイレクトのスローバックを防ぐ
OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
}

# デバッグログを有効化（開発環境のみ）
if Rails.env.development?
  OmniAuth.config.logger = Rails.logger
end