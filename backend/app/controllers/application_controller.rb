class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  
  # DeviseのJWT認証設定
  before_action :configure_permitted_parameters, if: :devise_controller?
  
  # JWT認証エラーハンドリング
  rescue_from JWT::DecodeError, with: :invalid_token
  rescue_from JWT::ExpiredSignature, with: :expired_token
  
  # JWTトークンからユーザーを設定
  def authenticate_user!
    if request.headers['Authorization'].present?
      begin
        token = request.headers['Authorization'].split(' ').last
        decoded_token = JWT.decode(token, ENV['DEVISE_JWT_SECRET_KEY'])
        @current_user_id = decoded_token[0]['sub']
      rescue JWT::DecodeError => e
        Rails.logger.error "JWT Decode Error: #{e.message}"
        render json: { error: 'Invalid token' }, status: :unauthorized
        return
      rescue JWT::ExpiredSignature
        Rails.logger.error "JWT Expired Signature"
        render json: { error: 'Token has expired' }, status: :unauthorized
        return
      end
    else
      Rails.logger.error "No Authorization header present"
      render json: { error: 'Authorization header missing' }, status: :unauthorized
      return
    end
    
    @current_user = User.find_by(id: @current_user_id)
    
    unless @current_user
      Rails.logger.error "User not found with ID: #{@current_user_id}"
      render json: { error: 'User not found' }, status: :unauthorized
      return
    end
  end
  
  def current_user
    @current_user
  end
  
  protected
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :weight, :height, :age, :gender, :image])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :weight, :height, :age, :gender, :image])
  end
  
  private
  
  def invalid_token
    render json: { error: 'Invalid token' }, status: :unauthorized
  end
  
  def expired_token
    render json: { error: 'Token has expired' }, status: :unauthorized
  end
end