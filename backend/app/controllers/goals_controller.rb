class GoalsController < ApplicationController
  def show
    goal = Goal.find(params[:id])
    render json: goal
  end

  def create
    # 既存の目標を検索し、存在する場合は更新、存在しない場合は新規作成
    goal = Goal.first_or_initialize(user_id: goal_params[:user_id], goal_type: goal_params[:goal_type])
    if goal.update(goal_params)
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