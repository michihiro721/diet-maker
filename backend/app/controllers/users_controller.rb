class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :log_authentication_headers, only: [:show, :update]

  def show
    user_id = params[:id].to_i
    
    # リクエストされたIDがログインユーザーと一致するか確認
    if user_id == current_user.id
      render json: {
        email: current_user.email,
        nickname: current_user.name,
        weight: current_user.weight,
        height: current_user.height,
        age: current_user.age,
        gender: current_user.gender
      }
    else
      # 他ユーザー情報へのアクセスを試みている場合は基本情報のみ返す
      # または完全に拒否することも可能
      user = User.find_by(id: user_id)
      if user
        render json: {
          nickname: user.name
          # 公開情報のみ返すか、アクセス拒否にするかはポリシーによる
        }
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end
  end

  def update
    if current_user.update(user_params)
      render json: {
        message: 'Profile updated successfully.',
        user: {
          email: current_user.email,
          nickname: current_user.name,
          weight: current_user.weight,
          height: current_user.height,
          age: current_user.age,
          gender: current_user.gender
        }
      }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :weight, :height, :age, :gender)
  end
  
  def log_authentication_headers
    Rails.logger.debug "Authorization Header: #{request.headers['Authorization']}"
    Rails.logger.debug "Current User: #{current_user.inspect}" if user_signed_in?
    Rails.logger.debug "Requested User ID: #{params[:id]}"
  end
end