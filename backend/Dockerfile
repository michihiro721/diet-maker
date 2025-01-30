FROM ruby:3.3.6

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

WORKDIR /myapp

COPY backend/Gemfile /myapp/Gemfile
COPY backend/Gemfile.lock /myapp/Gemfile.lock

RUN gem install bundler -v 2.6.2
RUN bundle _2.6.2_ install

COPY backend /myapp

CMD ["sh", "-c", "rm -f /myapp/tmp/pids/server.pid && bundle exec rails server -b 0.0.0.0 -p 3000"]