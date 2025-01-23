#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

bundle install

# Ensure necessary files exist
if [ ! -f "config/boot.rb" ]; then
  echo "config/boot.rb not found, creating it"
  echo "ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)" > config/boot.rb
  echo "require 'bundler/setup' # Set up gems listed in the Gemfile." >> config/boot.rb
fi

# Install jsbundling-rails
bundle exec rails javascript:install:esbuild

# Build JavaScript assets
cd ../frontend
bun install
bun run build
cd ../backend

bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rails db:create
bundle exec rake db:migrate