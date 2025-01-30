FROM ruby:3.3.6

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

WORKDIR /myapp

COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

RUN gem install bundler -v 2.6.2
RUN bundle _2.6.2_ install

COPY . /myapp


CMD ["sh", "-c", "rm -f /myapp/tmp/pids/server.pid && bundle exec rails server -b 0.0.0.0 -p 3000"]