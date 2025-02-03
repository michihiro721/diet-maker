class CreateSteps < ActiveRecord::Migration[7.1]
  def change
    create_table :steps do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.integer :steps
      t.float :calories_burned

      t.timestamps
    end
  end
end
