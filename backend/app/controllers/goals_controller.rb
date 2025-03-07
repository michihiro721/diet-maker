class GoalsController < ApplicationController
  def show
    goal = Goal.find(params[:id])
    render json: goal
  end

  def create
    # user_idとgoal_typeに基づいて既存の目標を検索
    existing_goal = Goal.find_by(user_id: goal_params[:user_id], goal_type: goal_params[:goal_type])
    
    if existing_goal
      # 既存のレコードが見つかれば更新
      if existing_goal.update(goal_params)
        render json: existing_goal, status: :ok
      else
        render json: existing_goal.errors, status: :unprocessable_entity
      end
    else
      # 見つからなければ新規作成
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
    # パラメータでuser_idが指定されていれば、そのユーザーの最新の目標を取得
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