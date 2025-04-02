
# 目標設定機能のモデル部分テスト
#  目標データ（現在体重、目標体重、目標達成予定日）がモデルを通じて正しくデータベースに保存できることの確認
#  データベースに保存された目標データが正しく更新できることの確認


require 'rails_helper'

RSpec.describe Goal, type: :model do
  # テスト用ユーザーを作成
  let(:user) do
    User.create(
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123'
    )
  end

  describe "目標の保存機能" do
    it "有効な目標データが保存できること" do
      goal = Goal.new(
        user_id: user.id,
        goal_type: 'weight_loss',
        target_weight: 65.0,
        start_date: Date.today,
        end_date: Date.today + 30.days
      )

      # 保存できることを確認
      expect(goal.save).to be true

      # 保存された値を確認
      saved_goal = Goal.find(goal.id)
      expect(saved_goal.user_id).to eq(user.id)
      expect(saved_goal.target_weight).to eq(65.0)
      expect(saved_goal.start_date.to_s).to eq(Date.today.to_s)
      expect(saved_goal.end_date.to_s).to eq((Date.today + 30.days).to_s)
    end
  end

  describe "目標の更新機能" do
    # 既存の目標を作成
    let!(:existing_goal) do
      Goal.create!(
        user_id: user.id,
        goal_type: 'weight_loss',
        target_weight: 70.0,
        start_date: Date.today,
        end_date: Date.today + 30.days
      )
    end

    it "目標データを更新できること" do
      # 目標体重と目標達成予定日を更新
      existing_goal.target_weight = 62.5
      existing_goal.end_date = Date.today + 45.days

      # 更新できることを確認
      expect(existing_goal.save).to be true

      # 更新された値を確認
      updated_goal = Goal.find(existing_goal.id)
      expect(updated_goal.target_weight).to eq(62.5)
      expect(updated_goal.end_date.to_s).to eq((Date.today + 45.days).to_s)
    end
  end
end
