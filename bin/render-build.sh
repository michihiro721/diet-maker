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

bundle exec rake assets:precompile
echo "Assets precompile completed"
bundle exec rake assets:clean
echo "Assets clean completed"
bundle exec rails db:create
echo "Database creation completed"
bundle exec rake db:migrate
echo "Database migration completed"

echo "Build script completed successfully"