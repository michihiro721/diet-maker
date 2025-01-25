#!/usr/bin/env bash
# exit on error
set -o errexit

# Change to the backend directory
cd ./backend/bin/render-build.sh

bundle install
bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rake db:migrate