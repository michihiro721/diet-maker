# トレーニング機能のモデル部分テスト

# 1. 複数のトレーニングデータを一括保存する機能
# 2. ユーザーごとの各トレーニング種目の最大重量を取得する機能
# 3. 指定期間内のトレーニング実施日を取得する機能
# 4. 特定日付のトレーニングデータを削除する機能

require 'rails_helper'

RSpec.describe Training, type: :model do
  # テスト用ユーザーを事前に作成
  let(:user) do
    User.create!(
      name: 'テストユーザー',
      email: 'test_training@example.com',
      password: 'password123'
    )
  end

  # テスト用ワークアウトを事前に作成
  let(:workout) do
    Workout.create!(
      name: 'テストワークアウト',
      category: 'strength'
    )
  end

  describe '.create_trainings' do
    it 'トレーニングデータを保存できること' do
      # テスト用のパラメータ
      params = [
        {
          date: Date.today.to_s,
          user_id: user.id,
          workout_id: workout.id,
          sets: 3,
          reps: 10,
          weight: 80.5
        }
      ]

      # 実際のデータベースを使用してテスト
      result = Training.create_trainings(params)
      expect(result).to eq(true)

      # データが保存されたか確認
      training = Training.last
      expect(training.user_id).to eq(user.id)
      expect(training.sets).to eq(3)
      expect(training.weight).to eq(80.5)
    end

    it '空のパラメータの場合は失敗すること' do
      result = Training.create_trainings([])
      expect(result).to eq(false)
    end
  end

  describe '.max_weights_for_user' do
    before do
      # テストデータの準備
      Training.create!(
        user_id: user.id,
        workout_id: workout.id,
        date: Date.today - 1.day,
        sets: 3,
        reps: 10,
        weight: 80.5
      )

      Training.create!(
        user_id: user.id,
        workout_id: workout.id,
        date: Date.today,
        sets: 3,
        reps: 10,
        weight: 85.0
      )
    end

    it 'ユーザーの最大重量を返すこと' do
      result = Training.max_weights_for_user(user.id)
      expect(result[workout.id]).to eq(85.0)
    end

    it 'ユーザーIDがない場合はnilを返すこと' do
      result = Training.max_weights_for_user(nil)
      expect(result).to be_nil
    end
  end

  describe '.monthly_training_dates' do
    let(:start_date) { Date.today.beginning_of_month }
    let(:end_date) { Date.today.end_of_month }

    before do
      # 月初めと中旬にトレーニングを作成
      Training.create!(
        user_id: user.id,
        workout_id: workout.id,
        date: start_date,
        sets: 3,
        reps: 10,
        weight: 80.5
      )

      Training.create!(
        user_id: user.id,
        workout_id: workout.id,
        date: start_date + 15.days,
        sets: 3,
        reps: 10,
        weight: 85.0
      )
    end

    it '指定期間内のトレーニング日を取得すること' do
      result = Training.monthly_training_dates(start_date, end_date, user.id)
      expect(result.count).to eq(2)
      dates = result.pluck(:date).map(&:to_s)
      expect(dates).to include(start_date.to_s)
      expect(dates).to include((start_date + 15.days).to_s)
    end
  end

  describe '.destroy_trainings_by_date' do
    let(:test_date) { Date.today }

    before do
      # テスト用のトレーニングを作成
      2.times do
        Training.create!(
          user_id: user.id,
          workout_id: workout.id,
          date: test_date,
          sets: 3,
          reps: 10,
          weight: 80.5
        )
      end
    end

    it '指定日付のトレーニングを削除できること' do
      # 削除前の確認
      expect(Training.where(date: test_date, user_id: user.id).count).to eq(2)

      # 削除実行
      result = Training.destroy_trainings_by_date(test_date, user.id)

      # 削除後の確認
      expect(result).to eq(true)
      expect(Training.where(date: test_date, user_id: user.id).count).to eq(0)
    end
  end
end
