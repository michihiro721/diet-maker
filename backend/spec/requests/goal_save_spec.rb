require 'rails_helper'

RSpec.describe "目標設定機能", type: :request do
  # テスト用ユーザーを作成
  let(:user) do
    User.create(
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123'
    )
  end

  # 有効な目標データ
  let(:valid_goal_params) do
    {
      goal: {
        user_id: user.id,
        target_weight: 65.0,
        start_date: Date.today.to_s,
        end_date: (Date.today + 30.days).to_s,
        goal_type: 'weight_loss'
      }
    }
  end

  describe "目標の保存機能" do
    context "有効なパラメータの場合" do
      it "新しい目標を保存できること" do
        # 事前にユーザーと現在の目標数を確認
        expect(user).to be_present
        initial_count = Goal.count

        # POSTリクエストを送信
        post "/goals", params: valid_goal_params
        
        # レスポンスの確認
        expect(response).to have_http_status(201).or have_http_status(200)
        
        # 目標が1件増えていることを確認
        expect(Goal.count).to eq(initial_count + 1)
        
        # 作成された目標の内容を確認
        goal = Goal.last
        expect(goal.user_id).to eq(user.id)
        expect(goal.target_weight).to eq(65.0)
        expect(goal.start_date.to_s).to eq(Date.today.to_s)
        expect(goal.end_date.to_s).to eq((Date.today + 30.days).to_s)
      end
    end

    context "既存の目標がある場合" do
      # 既存の目標を作成
      let!(:existing_goal) do
        Goal.create(
          user_id: user.id,
          target_weight: 70.0,
          start_date: Date.today - 10.days,
          end_date: Date.today + 20.days,
          goal_type: 'weight_loss'
        )
      end

      it "目標を更新できること" do
        # 更新用パラメータ
        update_params = {
          goal: {
            target_weight: 62.5,
            end_date: (Date.today + 40.days).to_s
          }
        }

        # PUTリクエストを送信
        put "/goals/#{existing_goal.id}", params: update_params
        
        # レスポンスの確認
        expect(response).to have_http_status(200).or have_http_status(204)
        
        # 更新された目標の内容を確認
        existing_goal.reload
        expect(existing_goal.target_weight).to eq(62.5).or eq(update_params[:goal][:target_weight])
        
        # 日付が文字列で返ってくる場合と日付オブジェクトで返ってくる場合の両方に対応
        if existing_goal.end_date.is_a?(String)
          expect(existing_goal.end_date).to eq(update_params[:goal][:end_date])
        else
          expect(existing_goal.end_date.to_s).to eq(Date.parse(update_params[:goal][:end_date]).to_s)
        end
      end
    end
  end
end