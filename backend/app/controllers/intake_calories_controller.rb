class IntakeCaloriesController < ApplicationController
  def index
    if params[:user_id].present?
      intake_calories = IntakeCalorie.where(user_id: params[:user_id])
    else
      intake_calories = IntakeCalorie.all
    end
    render json: intake_calories
  end

  def create
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
