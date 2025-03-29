# 目標設定機能のコントローラー部分をテストします。
#  新規目標データ（現在体重、目標体重、目標達成予定日）の保存機能
#  既存の目標データの更新機能


require 'rails_helper'

RSpec.describe GoalsController, type: :controller do
  # テスト用ユーザーを作成
  let(:user) do
    User.create(
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123'
    )
  end

  # 有効な目標データ
  let(:valid_attributes) do
    {
      user_id: user.id,
      goal_type: 'weight_loss',
      target_weight: 65.0,
      start_date: Date.today.to_s,
      end_date: (Date.today + 30.days).to_s
    }
  end

  describe "POST #create" do
    it "目標データを保存できること" do
      # 事前に目標数を確認
      initial_count = Goal.count

      # 認証関連のスタブ (必要に応じて調整)
      allow_any_instance_of(GoalsController).to receive(:authenticate_user!).and_return(true)
      allow_any_instance_of(GoalsController).to receive(:current_user).and_return(user)

      # POSTリクエスト
      post :create, params: { goal: valid_attributes }
      
      # ステータスコードの確認
      expect(response).to have_http_status(:created).or have_http_status(:ok)
      
      # 目標が1件増えていることを確認
      expect(Goal.count).to eq(initial_count + 1)
      
      # 作成された目標の内容を確認
      goal = Goal.last
      expect(goal.user_id).to eq(user.id)
      expect(goal.target_weight).to eq(65.0)
      expect(goal.start_date.to_s).to eq(Date.today.to_s)
      expect(goal.end_date.to_s).to eq((Date.today + 30.days).to_s)
      expect(goal.goal_type).to eq('weight_loss')
    end
  end

  describe "PUT #update" do
    # 既存の目標を作成
    let!(:goal) do 
      Goal.create!(
        user_id: user.id,
        goal_type: 'weight_loss',
        target_weight: 70.0,
        start_date: Date.today - 10.days,
        end_date: Date.today + 20.days
      )
    end

    it "目標データを更新できること" do
      # 更新用パラメータ
      new_attributes = {
        target_weight: 62.5,
        end_date: (Date.today + 45.days).to_s
      }

      # 認証関連のスタブ
      allow_any_instance_of(GoalsController).to receive(:authenticate_user!).and_return(true)
      allow_any_instance_of(GoalsController).to receive(:current_user).and_return(user)

      # PUTリクエスト
      put :update, params: { id: goal.id, goal: new_attributes }
      
      # ステータスコードの確認
      expect(response).to have_http_status(:ok).or have_http_status(:no_content)
      
      # 更新された目標の内容を確認
      goal.reload
      expect(goal.target_weight).to eq(62.5)
      
      # 日付が文字列で返ってくる場合と日付オブジェクトで返ってくる場合の両方に対応
      if goal.end_date.is_a?(String)
        expect(goal.end_date).to eq(new_attributes[:end_date])
      else
        expect(goal.end_date.to_s).to eq(Date.parse(new_attributes[:end_date]).to_s)
      end
    end
  end
end