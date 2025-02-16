class TrainingsController < ApplicationController
  def create
    training_params[:sets].each do |set|
      training = Training.new(
        user_id: training_params[:user_id],
        goal_id: training_params[:goal_id],
        workout_id: training_params[:workout_id],
        date: training_params[:date],
        sets: set[:sets],
        reps: set[:reps],
        weight: set[:weight]
      )

      unless training.save
        render json: training.errors, status: :unprocessable_entity
        return
      end
    end

    render json: { message: 'Training records saved successfully' }, status: :created
  end

  private

  def training_params
    params.require(:training).permit(:date, :user_id, :goal_id, :workout_id, sets: [:sets, :reps, :weight])
  end
end