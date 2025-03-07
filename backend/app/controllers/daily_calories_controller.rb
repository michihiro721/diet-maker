class DailyCaloriesController < ApplicationController
  def index
    if params[:user_id].present?
      daily_calories = DailyCalorie.where(user_id: params[:user_id])
    else
      daily_calories = DailyCalorie.all
    end
    render json: daily_calories
  end

  def create
    Rails.logger.info("Received params: #{params.inspect}")
    daily_calorie = DailyCalorie.find_or_initialize_by(user_id: daily_calorie_params[:user_id], date: daily_calorie_params[:date])
    daily_calorie.assign_attributes(daily_calorie_params)

    if daily_calorie.save
      render json: daily_calorie, status: :created
    else
      render json: daily_calorie.errors, status: :unprocessable_entity
    end
  end

  private

  def daily_calorie_params
    params.require(:daily_calorie).permit(:user_id, :date, :total_calories)
  end
end