# ホーム画面のトレーニングデータ（日付、ユーザーID、セット数、回数、重量）保存機能のテスト

require 'rails_helper'

RSpec.describe TrainingsController, type: :controller do
  describe '#create' do
    it 'トレーニングデータを保存できる' do
      # テスト用
      training_params = {
        training: [
          {
            date: '2025-03-29',
            user_id: 1,
            sets: 3,
            reps: '10',
            weight: 80.5
          }
        ]
      }

      allow(Training).to receive(:create_trainings).and_return(true)

      # 実行
      post :create, params: training_params

      # 検証
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['message']).to eq('Training records saved successfully')
    end

    it 'トレーニングデータの保存が失敗したとき適切なエラーレスポンスを返す' do
      # テスト用
      training_params = {
        training: [
          {
            date: '2025-03-29',
            user_id: 1,
            sets: 3,
            reps: '10',
            weight: 80.5
          }
        ]
      }

      # 失敗ケースをモック
      allow(Training).to receive(:create_trainings).and_return("バリデーションエラー")

      # 実行
      post :create, params: training_params

      # 検証
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)['errors']).to eq("バリデーションエラー")
    end
  end
end