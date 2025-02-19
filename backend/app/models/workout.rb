class Workout < ApplicationRecord
  has_many :trainings

  validates :name, presence: true
  validates :category, presence: true
end