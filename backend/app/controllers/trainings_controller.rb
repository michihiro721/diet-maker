class TrainingsController < ApplicationController
  def index
    date = params[:date]
    user_id = params[:user_id] # ユーザーIDをパラメーターから直接取得（デフォルト値を削除）

    trainings = Training.where(date: date, user_id: user_id)
    render json: trainings
  end

  def create
    # 受け取ったトレーニングデータの日付とユーザーIDを取得
    date = training_params.first[:date]
    user_id = training_params.first[:user_id]

    # 該当の日付とユーザーIDの既存データを取得
    existing_trainings = Training.where(date: date, user_id: user_id)

    # 既存データを削除
    existing_trainings.destroy_all

    # 新しいデータを保存
    training_params.each do |training|
      new_training = Training.new(
        user_id: training[:user_id],
        goal_id: training[:goal_id],
        workout_id: training[:workout_id],
        date: training[:date],
        sets: training[:sets],
        reps: training[:reps],
        weight: training[:weight]
      )

      unless new_training.save
        Rails.logger.error new_training.errors.full_messages
        render json: new_training.errors, status: :unprocessable_entity
        return
      end
    end

    render json: { message: 'Training records saved successfully' }, status: :created
  end

  def monthly
    start_date = params[:start_date]
    end_date = params[:end_date]
    user_id = params[:user_id]
    
    # 指定された期間とユーザーIDに基づいてトレーニングデータを取得
    trainings = Training.where(
      "date >= ? AND date <= ? AND user_id = ?", 
      start_date, end_date, user_id
    )
    
    # 日付ごとにグループ化
    result = trainings.select(:date).distinct
    
    render json: result
  end
  
  def destroy_by_date
    date = params[:date]
    user_id = params[:user_id]
    
    trainings = Training.where(date: date, user_id: user_id)
    
    if trainings.destroy_all
      render json: { message: 'Training records successfully deleted' }, status: :ok
    else
      render json: { error: 'Failed to delete training records' }, status: :unprocessable_entity
    end
  end

  # ユーザーの種目ごとの最大重量を返すアクション
  def max_weights
    user_id = params[:user_id]
    
    # ユーザーIDが必要
    unless user_id.present?
      render json: { error: 'ユーザーIDが必要です' }, status: :bad_request
      return
    end
    
    # SQL文でワークアウトごとの最大重量を取得
    max_weights_data = Training.select('workout_id, MAX(weight) as max_weight')
                            .where(user_id: user_id)
                            .where('weight > 0') # 重量が0より大きい記録だけ対象
                            .where('workout_id IS NOT NULL')
                            .group(:workout_id)
    
    # workout_idをキー、max_weightを値とするハッシュを作成
    result = {}
    max_weights_data.each do |record|
      result[record.workout_id] = record.max_weight
    end
    
    render json: result
  end

  private

  def training_params
    params.require(:training).map do |training|
      training.permit(:date, :user_id, :goal_id, :workout_id, :sets, :reps, :weight)
    end
  end
end