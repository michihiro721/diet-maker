class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show_by_id]
  
  # 認証済みユーザーの情報を返す
  def show
    # ユーザーがログインしていない場合
    unless current_user
      render json: { error: 'User not authenticated' }, status: :unauthorized
      return
    end
    
    render json: {
      id: current_user.id,
      email: current_user.email,
      name: current_user.name,
      weight: current_user.weight,
      height: current_user.height,
      age: current_user.age,
      gender: current_user.gender,
      provider: current_user.provider,
      uid: current_user.uid,
      image: current_user.image,
      created_at: current_user.created_at,
      updated_at: current_user.updated_at
    }
  end
  
  # IDでユーザー情報を取得（認証なし）
  def show_by_id
    user = User.find_by(id: params[:id])
    
    if user
      render json: {
        id: user.id,
        name: user.name,
        image: user.image
      }
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  def update
    if current_user.update(user_params)
      render json: {
        message: 'Profile updated successfully.',
        user: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          weight: current_user.weight,
          height: current_user.height,
          age: current_user.age,
          gender: current_user.gender,
          provider: current_user.provider,
          uid: current_user.uid,
          image: current_user.image
        }
      }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :weight, :height, :age, :gender, :image)
  end
end