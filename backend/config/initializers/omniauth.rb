# OmniAuthの設定やパス接頭辞は削除する
# Rails.application.config.middleware.use OmniAuth::Builder do
#   provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'], {
#     scope: 'email,profile',
#     prompt: 'select_account',
#     access_type: 'offline'
#   }
# end

# OmniAuth.config.path_prefix = '/auth' は削除


OmniAuth.config.allowed_request_methods = [:post, :get]