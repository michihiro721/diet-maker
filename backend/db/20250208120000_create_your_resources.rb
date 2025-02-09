class CreateYourResources < ActiveRecord::Migration[7.1]
  def change
    create_table :your_resources do |t|
      t.string :attribute1
      t.string :attribute2

      t.timestamps
    end
  end
end