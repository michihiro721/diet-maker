class WeightsController < ApplicationController
  def index
    weights = Weight.all
    render json: weights
  end

  def create
    weight = Weight.find_or_initialize_by(user_id: weight_params[:user_id], date: weight_params[:date])
    weight.assign_attributes(weight_params)

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