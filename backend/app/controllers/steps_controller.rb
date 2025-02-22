class StepsController < ApplicationController
  def index
    steps = Step.where(user_id: 1) # デフォルトで user_id を 1 に設定
    render json: steps
  end

  def create
    Rails.logger.info("Received params: #{params.inspect}") # デバッグコード
    step = Step.find_or_initialize_by(user_id: step_params[:user_id], date: step_params[:date])
    step.assign_attributes(step_params)

    if step.save
      render json: step, status: :created
    else
      render json: step.errors, status: :unprocessable_entity
    end
  end

  private

  def step_params
    params.require(:step).permit(:user_id, :date, :steps, :calories_burned)
  end
end