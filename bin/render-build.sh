#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

bundle install

# Ensure necessary files exist
if [ ! -f "config/boot.rb" ]; then
  echo "config/boot.rb not found, skipping jsbundling-rails installation"
else
  # Install jsbundling-rails
  bundle exec rails javascript:install:esbuild
fi

# Build JavaScript assets
cd ../frontend
bun install
bun run build
cd ../backend

bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rails db:create
bundle exec rake db:migrate