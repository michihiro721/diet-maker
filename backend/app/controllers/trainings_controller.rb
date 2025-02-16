class TrainingsController < ApplicationController
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
    params.require(:training).permit(:date, trainings: [:exercise, :targetArea, :maxWeight, sets: [:weight, :reps, :complete, :timer]])
  end
end