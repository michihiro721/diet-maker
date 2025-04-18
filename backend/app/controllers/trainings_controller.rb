class TrainingsController < ApplicationController
  def index
    date = params[:date]
    user_id = params[:user_id]

    trainings = Training.where(date: date, user_id: user_id)
    render json: trainings
  end

  def create
    date = training_params.first[:date]
    user_id = training_params.first[:user_id]

    existing_trainings = Training.where(date: date, user_id: user_id)

    existing_trainings.destroy_all

    training_params.each do |training|
      new_training = Training.new(
        user_id: training[:user_id],
        goal_id: training[:goal_id],
        workout_id: training[:workout_id],
        date: training[:date],
        sets: training[:sets],
        reps: training[:reps],
        weight: training[:weight]
      )

      unless new_training.save
        render json: new_training.errors, status: :unprocessable_entity
        return
      end
    end

    render json: { message: "Training records saved successfully" }, status: :created
  end

  def monthly
    start_date = params[:start_date]
    end_date = params[:end_date]
    user_id = params[:user_id]

    trainings = Training.where(
      "date >= ? AND date <= ? AND user_id = ?",
      start_date, end_date, user_id
    )

    result = trainings.select(:date).distinct

    render json: result
  end

  def destroy_by_date
    date = params[:date]
    user_id = params[:user_id]

    trainings = Training.where(date: date, user_id: user_id)

    if trainings.destroy_all
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

    max_weights_data = Training.select("workout_id, MAX(weight) as max_weight")
                            .where(user_id: user_id)
                            .where("weight > 0")
                            .where("workout_id IS NOT NULL")
                            .group(:workout_id)

    result = {}
    max_weights_data.each do |record|
      result[record.workout_id] = record.max_weight
    end

    render json: result
  end

  private

  def training_params
    params.require(:training).map do |training|
      training.permit(:date, :user_id, :goal_id, :workout_id, :sets, :reps, :weight)
    end
  end
end
