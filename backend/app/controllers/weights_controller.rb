class WeightsController < ApplicationController
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
    params.require(:weight).permit(:user_id, :date, :weight)
  end
end
