class CreateWorkouts < ActiveRecord::Migration[7.1]
  def change
    create_table :workouts do |t|
      t.string :name, null: false
      t.string :category
      t.float :calories_per_minute

      t.timestamps
    end
  end
end
