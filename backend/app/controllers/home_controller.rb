# app/controllers/home_controller.rb
class HomeController < ActionController::Base
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }

  def index
    render file: Rails.root.join("public", "index.html")
  end
end
