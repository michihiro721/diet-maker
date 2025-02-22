class IntakeCaloriesController < ApplicationController
  def index
    intake_calories = IntakeCalorie.where(user_id: 1) # デフォルトで user_id を 1 に設定
    render json: intake_calories
  end

  def create
    Rails.logger.info("Received params: #{params.inspect}") # デバッグコード
    intake_calorie = IntakeCalorie.find_or_initialize_by(user_id: intake_calorie_params[:user_id], date: intake_calorie_params[:date])
    intake_calorie.assign_attributes(intake_calorie_params)

    if intake_calorie.save
      render json: intake_calorie, status: :created
    else
      render json: intake_calorie.errors, status: :unprocessable_entity
    end
  end

  private

  def intake_calorie_params
    params.require(:intake_calorie).permit(:user_id, :date, :calories)
  end
end