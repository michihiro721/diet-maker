# app/controllers/users/passwords_controller.rb
class Users::PasswordsController < Devise::PasswordsController
  respond_to :json

  # パスワードリセットリクエスト
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    yield resource if block_given?

    if successfully_sent?(resource)
      render json: { message: "パスワードリセット手順が#{resource.email}に送信されました。" }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # トークンを使ってパスワードをリセット
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      render json: { message: "パスワードが正常に更新されました" }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # トークン検証用のエンドポイント
  def validate_token
    reset_password_token = params[:token]
    user = User.with_reset_password_token(reset_password_token)
    
    if user.present?
      render json: { valid: true }, status: :ok
    else
      render json: { valid: false, error: "無効なトークンです" }, status: :unprocessable_entity
    end
  end

  # パスワードリセット用メールのURLをカスタマイズ
  def after_sending_reset_password_instructions_path_for(resource_name)
    nil
  end

  protected

  def json_request?
    request.format.json?
  end
end