class Training < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :goal, optional: true
  belongs_to :workout, optional: true
  validates :date, presence: true
  validates :sets, numericality: { greater_than_or_equal_to: 0 }
  validates :reps, presence: true
  validates :weight, presence: true


  def self.max_weights_for_user(user_id)
    return nil unless user_id.present?

    max_weights_data = select("workout_id, MAX(weight) as max_weight")
                        .where(user_id: user_id)
                        .where("weight > 0")
                        .where("workout_id IS NOT NULL")
                        .group(:workout_id)

    result = {}
    max_weights_data.each do |record|
      result[record.workout_id] = record.max_weight
    end

    result
  end


  def self.monthly_training_dates(start_date, end_date, user_id)
    where(
      "date >= ? AND date <= ? AND user_id = ?",
      start_date, end_date, user_id
    ).select(:date).distinct
  end


  def self.destroy_trainings_by_date(date, user_id)
    trainings = where(date: date, user_id: user_id)
    trainings.destroy_all
    true
  rescue
    false
  end


  def self.create_trainings(training_params)
    return false if training_params.empty?

    date = training_params.first[:date]
    user_id = training_params.first[:user_id]

    transaction do

      where(date: date, user_id: user_id).destroy_all

      # 新しいトレーニングを作成
      training_params.each do |training|
        new_training = new(
          user_id: training[:user_id],
          goal_id: training[:goal_id],
          workout_id: training[:workout_id],
          date: training[:date],
          sets: training[:sets],
          reps: training[:reps],
          weight: training[:weight]
        )

        unless new_training.save
          raise ActiveRecord::Rollback, new_training.errors
        end
      end
    end

    true
  rescue => e
    e.message
  end
end