# ホーム画面のトレーニングデータ（日付、ユーザーID、セット数、回数、重量）保存機能のテスト

require 'rails_helper'

RSpec.describe TrainingsController, type: :controller do
  describe '#create' do
    it 'トレーニングデータを保存できる' do
      # テスト用のパラメータ
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
      
      # モックの準備
      training = instance_double(Training)
      allow(Training).to receive(:new).and_return(training)
      allow(training).to receive(:save).and_return(true)
      
      # 実行
      post :create, params: training_params
      
      # 検証
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['message']).to eq('Training records saved successfully')
    end
  end
end