class DailyCalorie < ApplicationRecord
  belongs_to :user

  validates :date, presence: true
  validates :steps, presence: true
  validates :total_calories, presence: true
  validates :intake_calories, presence: true
end