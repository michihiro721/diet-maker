class TrainingsController < ApplicationController
  def create
    training_params[:trainings].each do |training|
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
        Rails.logger.error new_training.errors.full_messages
        render json: new_training.errors, status: :unprocessable_entity
        return
      end
    end

    render json: { message: 'Training records saved successfully' }, status: :created
  end

  private

  def training_params
    params.permit(trainings: [:date, :user_id, :goal_id, :workout_id, :sets, :reps, :weight])
  end
end