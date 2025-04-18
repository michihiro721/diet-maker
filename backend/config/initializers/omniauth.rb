OmniAuth.config.allowed_request_methods = [ :post, :get ]
OmniAuth.config.silence_get_warning = true

OmniAuth.config.request_validation_phase = lambda { |env| }

OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
}


OmniAuth.config.logger = Rails.logger


if Rails.env.production?
  OmniAuth.config.full_host = "https://diet-maker-d07eb3099e56.herokuapp.com"
end
