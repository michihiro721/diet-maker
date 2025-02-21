class StepsController < ApplicationController
  def index
    steps = Step.where(user_id: 1) # デフォルトで user_id を 1 に設定
    render json: steps
  end

  def create
    Rails.logger.info("Received params: #{params.inspect}") # デバッグコード
    step = Step.new(step_params)
    step.user_id = 1  # デフォルトで user_id を 1 に設定

    if step.save
      render json: step, status: :created
    else
      render json: step.errors, status: :unprocessable_entity
    end
  end

  private

  def step_params
    params.require(:step).permit(:date, :steps, :calories_burned)
  end
end