#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

bundle install

# Build JavaScript assets
cd ../frontend
bun install
bun run build
cd ../backend

bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rails db:create
bundle exec rake db:migrate