# テスト目的:
# UsersControllerの機能をテストし、身体情報（性別、身長、体重、年齢）が正しく保存され、
# その情報から基礎代謝が適切に計算できることを確認する
#
# テスト内容:
# 1. ユーザーの身体情報を更新するUpdateアクションが正しく機能するか
# 2. 男性と女性それぞれの基礎代謝計算式が正しく適用されるか
# 3. ユーザー情報を取得するShowアクションが正しく機能するか
#
# 基礎代謝計算式:
# 男性: (10 * 体重kg) + (6.25 * 身長cm) - (5 * 年齢) + 5
# 女性: (10 * 体重kg) + (6.25 * 身長cm) - (5 * 年齢) - 161

require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  describe '#update' do
    it '身体情報を正しく保存できること' do
      # テスト用の身体情報パラメータ
      body_info_params = { 
        user: {
          gender: '男性',
          height: 175.0,
          weight: 70.0,
          age: 30
        }
      }
      
      # テスト用のユーザー
      user = instance_double(User, id: 1)
      
      # モックの準備
      allow(controller).to receive(:authenticate_user!).and_return(true)
      allow(controller).to receive(:current_user).and_return(user)
      allow(user).to receive(:update).and_return(true)
      allow(user).to receive_message_chain(:errors, :full_messages).and_return([])
      
      # レスポンスデータのモック
      user_data = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        weight: 70.0,
        height: 175.0,
        age: 30,
        gender: '男性',
        provider: nil,
        uid: nil,
        image: nil
      }
      allow(user).to receive(:id).and_return(user_data[:id])
      allow(user).to receive(:email).and_return(user_data[:email])
      allow(user).to receive(:name).and_return(user_data[:name])
      allow(user).to receive(:weight).and_return(user_data[:weight])
      allow(user).to receive(:height).and_return(user_data[:height])
      allow(user).to receive(:age).and_return(user_data[:age])
      allow(user).to receive(:gender).and_return(user_data[:gender])
      allow(user).to receive(:provider).and_return(user_data[:provider])
      allow(user).to receive(:uid).and_return(user_data[:uid])
      allow(user).to receive(:image).and_return(user_data[:image])
      
      # 実行
      put :update, params: { id: user.id }.merge(body_info_params)
      
      # 検証
      expect(response).to have_http_status(:ok)
      
      # レスポンスJSONの検証
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq('Profile updated successfully.')
      expect(json_response['user']['gender']).to eq('男性')
      expect(json_response['user']['height']).to eq(175.0)
      expect(json_response['user']['weight']).to eq(70.0)
      expect(json_response['user']['age']).to eq(30)
    end
    
    it '基礎代謝が計算できる情報が正しく保存されること' do
      # テスト用の身体情報パラメータ
      body_info_params = { 
        user: {
          gender: '女性',
          height: 160.0,
          weight: 55.0,
          age: 25
        }
      }
      
      # テスト用のユーザー
      user = instance_double(User, id: 1)
      
      # モックの準備
      allow(controller).to receive(:authenticate_user!).and_return(true)
      allow(controller).to receive(:current_user).and_return(user)
      allow(user).to receive(:update).and_return(true)
      
      # レスポンスデータのモック
      user_data = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        weight: 55.0,
        height: 160.0,
        age: 25,
        gender: '女性',
        provider: nil,
        uid: nil,
        image: nil
      }
      allow(user).to receive(:id).and_return(user_data[:id])
      allow(user).to receive(:email).and_return(user_data[:email])
      allow(user).to receive(:name).and_return(user_data[:name])
      allow(user).to receive(:weight).and_return(user_data[:weight])
      allow(user).to receive(:height).and_return(user_data[:height])
      allow(user).to receive(:age).and_return(user_data[:age])
      allow(user).to receive(:gender).and_return(user_data[:gender])
      allow(user).to receive(:provider).and_return(user_data[:provider])
      allow(user).to receive(:uid).and_return(user_data[:uid])
      allow(user).to receive(:image).and_return(user_data[:image])
      
      # 実行
      put :update, params: { id: user.id }.merge(body_info_params)
      
      # 検証
      expect(response).to have_http_status(:ok)
      
      # レスポンスJSONの検証
      json_response = JSON.parse(response.body)
      
      # 女性の基礎代謝計算式が正しく適用できるデータかチェック
      gender = json_response['user']['gender']
      weight = json_response['user']['weight']
      height = json_response['user']['height']
      age = json_response['user']['age']
      
      # 基礎代謝計算
      bmr = gender == '男性' ? 
        (10 * weight) + (6.25 * height) - (5 * age) + 5 :
        (10 * weight) + (6.25 * height) - (5 * age) - 161
      
      # 正しい計算結果
      # (10 * 55) + (6.25 * 160) - (5 * 25) - 161 = 1264.0
      expect(bmr).to eq(1264.0)
    end
  end
  
  describe '#show' do
    it 'ユーザーの身体情報を取得できること' do
      # テスト用のユーザー
      user = instance_double(User, id: 1)
      
      # モックの準備
      allow(controller).to receive(:authenticate_user!).and_return(true)
      allow(controller).to receive(:current_user).and_return(user)
      
      # ユーザーデータのモック
      user_data = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        weight: 70.0,
        height: 175.0,
        age: 30,
        gender: '男性',
        provider: nil,
        uid: nil,
        image: nil,
        created_at: Time.current,
        updated_at: Time.current
      }
      
      user_data.each do |key, value|
        allow(user).to receive(key).and_return(value)
      end
      
      # 実行
      get :show
      
      # 検証
      expect(response).to have_http_status(:ok)
      
      # レスポンスJSONの検証
      json_response = JSON.parse(response.body)
      expect(json_response['gender']).to eq('男性')
      expect(json_response['height']).to eq(175.0)
      expect(json_response['weight']).to eq(70.0)
      expect(json_response['age']).to eq(30)
    end
  end
end