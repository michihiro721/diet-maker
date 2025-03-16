class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: 'ログインしました' },
      user: resource
    }
  end

  def respond_to_on_destroy
    jwt_payload = JWT.decode(
      request.headers['Authorization'].split(' ')[1],
      ENV['DEVISE_JWT_SECRET_KEY'],
      true,
      { algorithm: 'HS256' }
    ).first

    user = User.find(jwt_payload['sub'])

    if user
      render json: { status: 200, message: 'ログアウトしました' }
    else
      render json: { status: 401, message: 'ユーザーが見つかりませんでした' }
    end
  rescue JWT::DecodeError
    render json: { status: 401, message: 'トークンが無効です' }
  end
end