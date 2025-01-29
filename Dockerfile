# ベースイメージ
FROM ruby:3.3.6

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

# アプリケーションディレクトリを作成
RUN mkdir /myapp
WORKDIR /myapp

# GemfileとGemfile.lockをコピー
COPY backend/Gemfile /myapp/Gemfile
COPY backend/Gemfile.lock /myapp/Gemfile.lock

# Bundlerをインストール
RUN bundle install

# アプリケーションのソースコードをコピー
COPY backend /myapp

# ポートを指定
EXPOSE 3000

# サーバーを起動
CMD ["rails", "server", "-b", "0.0.0.0"]