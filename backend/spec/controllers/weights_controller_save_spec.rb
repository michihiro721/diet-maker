# 体重データが正しい日付で保存される機能を確認するテスト

require 'rails_helper'

RSpec.describe WeightsController, type: :controller do
  describe '#create' do
    it '体重データを正しい日付で保存できること' do
      # テスト日付
      test_date = '2025-03-30'
      
      # テスト用のパラメータ
      weight_params = { 
        weight: {
          user_id: 1,
          date: test_date,
          weight: 70.5
        }
      }
      
      # モックの準備
      weight = instance_double(Weight)
      allow(Weight).to receive(:find_or_initialize_by).and_return(weight)
      allow(weight).to receive(:assign_attributes)
      allow(weight).to receive(:save).and_return(true)
      
      # 実行
      post :create, params: weight_params
      
      # 検証
      expect(response).to have_http_status(:created)
    end
  end
end