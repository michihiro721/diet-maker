class WeightsController < ApplicationController
  def index
    weights = Weight.all
    render json: weights
  end

  def create
    weight = Weight.new(weight_params)
    if weight.save
      render json: weight, status: :created
    else
      render json: weight.errors, status: :unprocessable_entity
    end
  end

  private

  def weight_params
    params.require(:weight).permit(:date, :weight)
  end
end