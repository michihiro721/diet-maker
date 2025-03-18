class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: JwtDenylist,
         omniauth_providers: [:google_oauth2]

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  
  # 投稿関連のリレーション追加
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  
  # OmniAuth認証からのユーザー作成・取得メソッド
  def self.from_omniauth(auth)
    # nilチェックを追加
    if auth.nil?
      Rails.logger.error "OmniAuth auth data is nil"
      return nil
    end
    
    # デバッグログ
    Rails.logger.info "OmniAuth auth data: provider=#{auth.provider}, uid=#{auth.uid}, email=#{auth.info.email}"
    
    # まずは既存ユーザーをメールアドレスで検索
    user = User.find_by(email: auth.info.email)
    
    if user
      # すでに同じプロバイダとUIDで認証済みかチェック
      if user.provider == auth.provider && user.uid == auth.uid
        Rails.logger.info "Existing user already authenticated with this provider: #{user.id}, #{user.email}"
      else
        # プロバイダとUIDを更新
        user.update(
          provider: auth.provider,
          uid: auth.uid
        )
        Rails.logger.info "Updated existing user with new provider info: #{user.id}, #{user.email}"
      end
      return user
    else
      # 新規ユーザーを作成
      Rails.logger.info "Creating new user for email: #{auth.info.email}"
      
      # 名前が無い場合はメールアドレスから生成
      display_name = auth.info.name.presence || auth.info.email.split('@').first
      
      # 新規ユーザーを作成
      new_user = User.new(
        provider: auth.provider,
        uid: auth.uid,
        email: auth.info.email,
        name: display_name,
        password: Devise.friendly_token[0, 20],
        image: auth.info.image
      )
      
      if new_user.save
        Rails.logger.info "Successfully created new user: #{new_user.id}, #{new_user.email}"
        return new_user
      else
        Rails.logger.error "Failed to create new user: #{new_user.errors.full_messages.join(', ')}"
        return nil
      end
    end
  end
  
  # JWTトークンを生成するメソッド
  def generate_jwt
    payload = {
      id: id,
      email: email,
      exp: 30.days.from_now.to_i,
      jti: SecureRandom.uuid # 一意のトークンID
    }
    
    secret_key = Rails.application.credentials.devise_jwt_secret_key || ENV['DEVISE_JWT_SECRET_KEY']
    JWT.encode(payload, secret_key)
  end
end