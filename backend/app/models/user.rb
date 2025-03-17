class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2],
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  
  # 投稿関連のリレーション追加
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  
  # OmniAuth認証からのユーザー作成・取得メソッド
  def self.from_omniauth(auth)
    # デバッグログを追加
    Rails.logger.info "OmniAuth auth data: #{auth.inspect}"
    
    # プロバイダとUIDでユーザーを検索、なければ作成
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name
      user.password = Devise.friendly_token[0, 20] # ランダムなパスワードを生成
      user.image = auth.info.image if auth.info.image.present?
    end
  end
end