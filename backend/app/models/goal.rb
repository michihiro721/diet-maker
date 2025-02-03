class Goal < ApplicationRecord
  belongs_to :user
  has_many :trainings

  validates :goal_type, presence: true
end