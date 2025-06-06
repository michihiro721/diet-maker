class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email, null: false

      t.float :weight
      t.float :height
      t.integer :age
      t.string :gender

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end
