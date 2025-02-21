class IntakeCaloriesController < ApplicationController
  def index
    intake_calories = IntakeCalorie.where(user_id: 1) # デフォルトで user_id を 1 に設定
    render json: intake_calories
  end

  def create
    Rails.logger.info("Received params: #{params.inspect}") # デバッグコード
    intake_calorie = IntakeCalorie.new(intake_calorie_params)
    intake_calorie.user_id = 1  # デフォルトで user_id を 1 に設定

    if intake_calorie.save
      render json: intake_calorie, status: :created
    else
      render json: intake_calorie.errors, status: :unprocessable_entity
    end
  end

  private

  def intake_calorie_params
    params.require(:intake_calorie).permit(:date, :calories)
  end
end