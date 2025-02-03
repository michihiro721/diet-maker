FROM ruby:3.3.6

# 環境変数の定義
ARG RAILS_ENV
ARG RAILS_MASTER_KEY

# 環境変数の設定
ENV RAILS_ENV $RAILS_ENV
ENV RAILS_MASTER_KEY $RAILS_MASTER_KEY
ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

WORKDIR /myapp

COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

RUN gem install bundler -v 2.6.2
RUN bundle _2.6.2_ install

COPY . /myapp

# 環境変数の確認
RUN env

CMD ["sh", "-c", "rm -f /myapp/tmp/pids/server.pid && bundle exec rails server -b 0.0.0.0 -p 3000"]