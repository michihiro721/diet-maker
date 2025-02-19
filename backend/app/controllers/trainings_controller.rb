class TrainingsController < ApplicationController
  def index
    date = params[:date]
    user_id = params[:user_id] || 1 # ユーザーIDを固定値に設定（ログイン機能実装後に変更）

    trainings = Training.where(date: date, user_id: user_id)
    render json: trainings
  end

  def create
    # 受け取ったトレーニングデータの日付とユーザーIDを取得
    date = training_params[:trainings].first[:date]
    user_id = training_params[:trainings].first[:user_id]

    # 該当の日付とユーザーIDの既存データを取得
    existing_trainings = Training.where(date: date, user_id: user_id)

    # 既存データを削除
    existing_trainings.destroy_all

    # 新しいデータを保存
    training_params[:trainings].each do |training|
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

  private

  def training_params
    params.require(:training).permit(trainings: [:date, :user_id, :goal_id, :workout_id, :sets, :reps, :weight])
  end
end