class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  # ログイン時のレスポンス
  def respond_with(resource, _opts = {})
    token = request.env['warden-jwt_auth.token']  # JWTトークンを取得
    if token
      headers['Authorization'] = "Bearer #{token}"  # 修正: ヘッダーを設定
      render json: { message: 'Logged in successfully.', token: token }, status: :ok
    else
      render json: { message: 'JWT token is missing' }, status: :unauthorized
    end
  end

  # ログアウト時のレスポンス
  def respond_to_on_destroy
    jwt_payload = request.env['warden-jwt_auth.token']
    current_user&.update(jti: SecureRandom.uuid)  # ユーザーの JTI を変更（トークンの失効）
    
    if jwt_payload
      render json: { message: 'Logged out successfully.' }, status: :ok
    else
      render json: { message: "Logged out failure." }, status: :unauthorized
    end
  end
end