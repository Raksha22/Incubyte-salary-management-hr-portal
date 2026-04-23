namespace :employees do
  desc "Insert 10,000 employees using db/data names (fast insert_all batches)"
  task seed_bulk: :environment do
    count = ENV.fetch("COUNT", 10_000).to_i
    start = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    inserted = Employees::BulkSeeder.call(count: count)
    elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - start
    puts "Inserted #{inserted} employees in #{elapsed.round(3)}s (#{(inserted / elapsed).round} rows/s)"
  end
end
