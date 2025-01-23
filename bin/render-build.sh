#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build script..."

cd backend
echo "Changed directory to backend"

bundle install
echo "Bundle install completed"

# Ensure necessary files exist
if [ ! -f "config/boot.rb" ]; then
  echo "config/boot.rb not found, creating it"
  echo "ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)" > config/boot.rb
  echo "require 'bundler/setup' # Set up gems listed in the Gemfile." >> config/boot.rb
fi

# Re-generate bin directory
echo "Re-generating bin directory..."
rm -rf bin
bundle exec rails app:update:bin
echo "Bin directory re-generated"

# Install jsbundling-rails
echo "Installing jsbundling-rails..."
bundle exec rails javascript:install:esbuild
echo "jsbundling-rails installation completed"

# Build JavaScript assets
cd ../frontend
echo "Changed directory to frontend"
bun install
echo "bun install completed"
bun run build
echo "bun run build completed"
cd ../backend
echo "Changed directory back to backend"

# Set environment variables for database connection
export DATABASE_USER=backend
export DATABASE_PASSWORD=password
export DATABASE_HOST=db
export DATABASE_PORT=5432

# Create and migrate the database
bundle exec rails db:create
echo "Database creation completed"
bundle exec rails db:migrate
echo "Database migration completed"

# Precompile and clean assets
bundle exec rake assets:precompile
echo "Assets precompile completed"
bundle exec rake assets:clean
echo "Assets clean completed"

echo "Build script completed successfully"