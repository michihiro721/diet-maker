class Weight < ApplicationRecord
  belongs_to :user

  validates :date, presence: true
  validates :weight, presence: true
  validates :user_id, uniqueness: { scope: :date, message: "Weight entry for this date already exists" }
end
