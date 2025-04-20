class GoalsController < ApplicationController
  def show
    goal = Goal.find(params[:id])
    render json: goal
  end

  def create
    existing_goal = Goal.find_by(user_id: goal_params[:user_id], goal_type: goal_params[:goal_type])

    if existing_goal
      if existing_goal.update(goal_params)
        render json: existing_goal, status: :ok
      else
        render json: existing_goal.errors, status: :unprocessable_entity
      end
    else
      goal = Goal.new(goal_params)
      if goal.save
        render json: goal, status: :created
      else
        render json: goal.errors, status: :unprocessable_entity
      end
    end
  end

  def update
    goal = Goal.find(params[:id])

    if goal.update(goal_params)
      render json: goal
    else
      render json: { errors: goal.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def latest
    if params[:user_id].present?
      goal = Goal.where(user_id: params[:user_id]).order(created_at: :desc).first
    else
      goal = Goal.order(created_at: :desc).first
    end

    if goal
      render json: goal
    else
      render json: {}, status: :ok
    end
  end

  private

  def goal_params
    params.require(:goal).permit(:user_id, :goal_type, :target_weight, :start_date, :end_date)
  end
end
