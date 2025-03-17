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
    
    # プロバイダとUIDでユーザーを検索、なければ作成
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name || auth.info.email.split('@').first
      user.password = Devise.friendly_token[0, 20] # ランダムなパスワードを生成
      user.image = auth.info.image if auth.info.image.present?
    end
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