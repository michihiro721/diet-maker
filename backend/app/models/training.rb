class Training < ApplicationRecord
  belongs_to :user
  belongs_to :goal, optional: true
  belongs_to :workout, optional: true

  validates :date, presence: true
end