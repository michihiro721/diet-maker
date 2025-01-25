#!/usr/bin/env bash
# exit on error
set -o errexit

# Change to the backend directory
cd backend

# Install the specified version of Bundler
gem install bundler -v 2.6.2

# Use the specified version of Bundler
bundle _2.6.2_ install

# Check if assets:precompile task exists
if bundle exec rake -T | grep -q "assets:precompile"; then
  bundle exec rake assets:precompile
  bundle exec rake assets:clean
fi

bundle install
bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rake db:migrate