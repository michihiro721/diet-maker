class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    user = User.find(params[:id])
    render json: { email: user.email, name: user.name }
  end

  def update
    user = User.find(params[:id])
    if user.update(user_params)
      render json: { message: 'Profile updated successfully.' }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name)
  end
end