class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  # ログイン時のレスポンス
  def respond_with(resource, _opts = {})
    token = request.env['warden-jwt_auth.token']  # JWTトークンを取得
    Rails.logger.info "🔍 取得したトークン: #{token}"

    if resource.persisted? && token
      response.set_header('Authorization', "Bearer #{token}")  # トークンをレスポンスヘッダーにセット
      render json: {
        status: { code: 200, message: 'Logged in successfully' },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes],
        token: token
      }, status: :ok
    else
      render json: { status: { message: 'Login failed' } }, status: :unauthorized
    end
  end

  # ログアウト時のレスポンス
  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      render json: { message: 'Logged out successfully' }, status: :ok
    else
      render json: { message: "Logout failed" }, status: :unauthorized
    end
  end
end