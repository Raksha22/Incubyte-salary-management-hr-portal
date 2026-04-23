class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :job_title, null: false
      t.string :country, null: false
      t.string :currency, null: false, default: "USD"
      t.decimal :annual_salary, precision: 14, scale: 2, null: false
      t.string :email, null: false
      t.string :department

      t.timestamps
    end

    add_index :employees, :email, unique: true
    add_index :employees, :country
    add_index :employees, %i[country job_title]
  end
end
