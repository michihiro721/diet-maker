class IntakeCalorie < ApplicationRecord
  belongs_to :user

  validates :date, presence: true
  validates :calories, presence: true
end