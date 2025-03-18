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
    return nil if auth.nil?
    
    # デバッグログを追加
    Rails.logger.info "OmniAuth auth data: #{auth.inspect}"
    
    # 既存ユーザーの検索 - まずはメールアドレスで検索
    user = User.find_by(email: auth.info.email)
    
    if user
      # 既存ユーザーが見つかった場合は、プロバイダとuidを更新
      user.update(provider: auth.provider, uid: auth.uid) unless user.provider == auth.provider && user.uid == auth.uid
      Rails.logger.info "Existing user found: #{user.id}, #{user.email}"
      return user
    end
    
    # 既存ユーザーが見つからない場合は新規作成
    Rails.logger.info "Creating new user with email: #{auth.info.email}"
    user = User.new(
      provider: auth.provider,
      uid: auth.uid,
      email: auth.info.email,
      name: auth.info.name || auth.info.email.split('@').first,
      password: Devise.friendly_token[0, 20], # ランダムなパスワードを生成
      image: auth.info.image
    )
    
    # ユーザー保存の試行とログ
    if user.save
      Rails.logger.info "New user created: #{user.id}, #{user.email}"
    else
      Rails.logger.error "Failed to create user: #{user.errors.full_messages.join(', ')}"
    end
    
    user
  end
  
  # JWTトークンを生成するメソッド
  def generate_jwt
    JWT.encode(
      { 
        id: id,
        exp: 30.days.from_now.to_i 
      },
      Rails.application.credentials.devise_jwt_secret_key || ENV['DEVISE_JWT_SECRET_KEY']
    )
  end
end