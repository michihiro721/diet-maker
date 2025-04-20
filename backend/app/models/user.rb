class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: JwtDenylist,
         omniauth_providers: [ :google_oauth2 ]

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy

  def self.from_omniauth(auth)
    if auth.nil?
      return nil
    end

    user = User.find_by(email: auth.info.email)

    if user
      if user.provider == auth.provider && user.uid == auth.uid
      else
        user.update(
          provider: auth.provider,
          uid: auth.uid
        )
      end
      user
    else

      display_name = auth.info.name.presence || auth.info.email.split("@").first


      new_user = User.new(
        provider: auth.provider,
        uid: auth.uid,
        email: auth.info.email,
        name: display_name,
        password: Devise.friendly_token[0, 20],
        image: auth.info.image
      )

      if new_user.save
        new_user
      else
        nil
      end
    end
  end

  def generate_jwt
    payload = {
      id: id,
      email: email,
      exp: 30.days.from_now.to_i,
      jti: SecureRandom.uuid
    }

    secret_key = Rails.application.credentials.devise_jwt_secret_key || ENV["DEVISE_JWT_SECRET_KEY"]
    JWT.encode(payload, secret_key)
  end
end
