class CreateIntakeCalories < ActiveRecord::Migration[7.1]
  def change
    create_table :intake_calories do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.integer :calories

      t.timestamps
    end
  end
end
