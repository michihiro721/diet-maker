class GoalsController < ApplicationController
  def show
    goal = Goal.find(params[:id])
    render json: goal
  end

  def create
    goal = Goal.new(goal_params)
    if goal.save
      render json: goal, status: :created
    else
      render json: goal.errors, status: :unprocessable_entity
    end
  end

  def latest
    goal = Goal.order(created_at: :desc).first
    if goal
      render json: goal
    else
      render json: { error: 'No goals found' }, status: :not_found
    end
  end

  private

  def goal_params
    params.require(:goal).permit(:user_id, :goal_type, :target_weight, :start_date, :end_date)
  end
end