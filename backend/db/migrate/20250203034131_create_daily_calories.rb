class CreateDailyCalories < ActiveRecord::Migration[7.1]
  def change
    create_table :daily_calories do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.float :total_calories

      t.timestamps
    end
  end
end