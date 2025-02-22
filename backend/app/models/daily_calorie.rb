class DailyCalorie < ApplicationRecord
  belongs_to :user

  validates :date, presence: true

  validates :total_calories, presence: true

end