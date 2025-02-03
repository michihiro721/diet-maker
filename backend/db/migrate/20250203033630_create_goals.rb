class CreateGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :goals do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.string :goal_type
      t.float :target_weight
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
