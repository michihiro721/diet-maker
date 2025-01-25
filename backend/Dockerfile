FROM ruby:3.1.4

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

WORKDIR /app

COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock

RUN gem install bundler -v 2.6.2
RUN bundle _2.6.2_ install

COPY . /app

CMD ["rails", "server", "-b", "0.0.0.0"]