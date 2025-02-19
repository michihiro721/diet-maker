class TrainingsController < ApplicationController
  def index
    if params[:date]
      date = Date.parse(params[:date])
      trainings = Training.where(date: date)
    else
      trainings = Training.all
    end
    render json: trainings
  end

  def create
    training = Training.new(training_params)
    if training.save
      render json: training, status: :created
    else
      render json: training.errors, status: :unprocessable_entity
    end
  end

  private

  def training_params
    params.require(:training).permit(:user_id, :goal_id, :workout_id, :date, :sets, :reps, :weight)
  end
end