class Training < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :goal, optional: true
  belongs_to :workout, optional: true

  validates :date, presence: true
  validates :sets, numericality: { greater_than_or_equal_to: 0 }
end