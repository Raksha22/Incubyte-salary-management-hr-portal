# Quick sample data for manual UI checks (no large dataset).
[
  {
    first_name: "Alex",
    last_name: "Morgan",
    job_title: "HR Business Partner",
    country: "United States",
    currency: "USD",
    annual_salary: 95_000,
    email: "alex.morgan@example.com",
    department: "People",
  },
  {
    first_name: "Priya",
    last_name: "Shah",
    job_title: "Software Engineer",
    country: "India",
    currency: "USD",
    annual_salary: 72_000,
    email: "priya.shah@example.com",
    department: "Engineering",
  },
  {
    first_name: "Jordan",
    last_name: "Lee",
    job_title: "Product Manager",
    country: "United Kingdom",
    currency: "GBP",
    annual_salary: 88_000,
    email: "jordan.lee@example.com",
    department: "Product",
  },
].each do |attrs|
  Employee.find_or_initialize_by(email: attrs[:email]).tap do |e|
    e.assign_attributes(attrs)
    e.save!
  end
end

puts "Seeded #{Employee.count} employees (sample). Run: bin/rails employees:seed_bulk"
