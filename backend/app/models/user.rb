class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, 
         jwt_revocation_strategy: JwtDenylist,
         :omniauthable, 
         omniauth_providers: [:google_oauth2]

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  
  # 投稿関連のリレーション追加
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  
  # Google OAuth認証からのユーザー作成・更新
  def self.from_omniauth(auth)
    Rails.logger.info "OmniAuth auth data: #{auth.inspect}"
    
    # プロバイダとUIDでユーザーを検索、なければ作成
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name || auth.info.email.split('@').first
      user.password = Devise.friendly_token[0, 20] # ランダムなパスワードを生成
      user.image = auth.info.image if auth.info.image.present?
    end
  end
end