class TrainingsController < ApplicationController
  def index
    date = params[:date]
    user_id = params[:user_id]
    trainings = Training.where(date: date, user_id: user_id)
    render json: trainings
  end

  def create
    result = Training.create_trainings(training_params)
    
    if result == true
      render json: { message: "Training records saved successfully" }, status: :created
    else
      render json: { errors: result }, status: :unprocessable_entity
    end
  end

  def monthly
    start_date = params[:start_date]
    end_date = params[:end_date]
    user_id = params[:user_id]
    
    result = Training.monthly_training_dates(start_date, end_date, user_id)
    render json: result
  end

  def destroy_by_date
    date = params[:date]
    user_id = params[:user_id]
    
    if Training.destroy_trainings_by_date(date, user_id)
      render json: { message: "Training records successfully deleted" }, status: :ok
    else
      render json: { error: "Failed to delete training records" }, status: :unprocessable_entity
    end
  end

  def max_weights
    user_id = params[:user_id]
    
    unless user_id.present?
      render json: { error: "ユーザーIDが必要です" }, status: :bad_request
      return
    end
    
    result = Training.max_weights_for_user(user_id)
    render json: result
  end

  private

  def training_params
    params.require(:training).map do |training|
      training.permit(:date, :user_id, :goal_id, :workout_id, :sets, :reps, :weight)
    end
  end
end