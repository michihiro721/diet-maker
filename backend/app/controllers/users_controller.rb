class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: {
      email: current_user.email,
      nickname: current_user.name,
      weight: current_user.weight,
      height: current_user.height,
      age: current_user.age,
      gender: current_user.gender
    }
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
end