class User < ApplicationRecord
  # Deviseモジュールの追加
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :email, presence: true, uniqueness: true
end