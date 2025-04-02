# OmniAuth設定
OmniAuth.config.allowed_request_methods = [ :post, :get ]
OmniAuth.config.silence_get_warning = true

# コールバックフェーズではCSRFチェックをスキップ
OmniAuth.config.request_validation_phase = lambda { |env| }

# リダイレクトのスローバックを防ぐ
OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
}

# すべての環境でログを有効化
OmniAuth.config.logger = Rails.logger

# デバッグモードを有効化
if Rails.env.production?
  OmniAuth.config.full_host = "https://diet-maker-d07eb3099e56.herokuapp.com"
end
