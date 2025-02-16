class CreateTrainings < ActiveRecord::Migration[7.1]
  def change
    create_table :trainings do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :goal, foreign_key: { to_table: :goals, on_delete: :cascade }
      t.references :workout, foreign_key: { to_table: :workouts, on_delete: :cascade }
      t.date :date, null: false
      t.json :sets, null: false, default: []

      t.timestamps
    end
  end
end
