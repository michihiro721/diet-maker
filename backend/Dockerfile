FROM ruby:3.1.2

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -\
    && echo 'deb http://dl.yarnpkg.com/debian/ stable main' > /etc/apt/sources.list.d/yarn.list

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt update -qq && apt install -y nodejs build-essential postgresql-client yarn \
    curl dirmngr apt-transport-https lsb-release ca-certificates \
    libxml2-dev libxslt1-dev zlib1g-dev libgmp-dev libffi-dev libsqlite3-dev

ENV APP_ROOT /app
RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD backend/Gemfile ${APP_ROOT}/Gemfile
ADD backend/Gemfile.lock ${APP_ROOT}/Gemfile.lock

RUN bundle config set force_ruby_platform true
RUN bundle install

ADD . ${APP_ROOT}

# Install JavaScript dependencies
WORKDIR /app/frontend
ADD frontend/package.json /app/frontend/package.json
ADD frontend/package-lock.json /app/frontend/package-lock.json
ADD frontend/app/javascript /app/frontend/app/javascript
RUN bun install

# Build JavaScript assets
RUN bun run build