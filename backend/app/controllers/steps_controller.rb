class StepsController < ApplicationController
  def index
    if params[:user_id].present?
      steps = Step.where(user_id: params[:user_id])
    else
      steps = Step.all
    end
    render json: steps
  end

  def create
    Rails.logger.info("Received params: #{params.inspect}")
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
