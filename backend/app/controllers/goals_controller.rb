class GoalsController < ApplicationController
  def create
    Rails.logger.info "Received request to create goal with params: #{goal_params.inspect}"
    
    user = User.find_by(id: goal_params[:user_id])
    unless user
      Rails.logger.error "User not found with id: #{goal_params[:user_id]}"
      render json: { errors: ["User not found"] }, status: :unprocessable_entity
      return
    end

    goal = Goal.find_or_initialize_by(user_id: goal_params[:user_id])
    if goal.update(goal_params)
      Rails.logger.info "Goal saved successfully"
      render json: { message: 'Goal saved successfully' }, status: :created
    else
      Rails.logger.error "Error saving goal: #{goal.errors.full_messages.join(", ")}"
      render json: { errors: goal.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def goal_params
    params.require(:goal).permit(:user_id, :goal_type, :target_weight, :start_date, :end_date)
  end
end