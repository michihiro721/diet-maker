class DailyCaloriesController < ApplicationController
  def create
    daily_calorie = DailyCalorie.new(daily_calorie_params)
    daily_calorie.user_id = 1  # デフォルトで user_id を 1 に設定 ログイン機能実装後はdaily_calorie.user = current_user に変更する

    if daily_calorie.save
      render json: daily_calorie, status: :created
    else
      render json: daily_calorie.errors, status: :unprocessable_entity
    end
  end

  private

  def daily_calorie_params
    params.require(:daily_calorie).permit(:date, :steps, :total_calories, :intake_calories)
  end
end