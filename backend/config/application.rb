require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module DietMaker
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Enable the asset pipeline
    config.assets.enabled = true
    config.assets.version = '1.0'

    # Ensure the application is initialized
    config.after_initialize do
      if Rails.logger.nil?
        Rails.logger = ActiveSupport::Logger.new(STDOUT)
        Rails.logger.formatter = ::Logger::Formatter.new
      end
      Rails.logger.warn "Application initialized"
    end

    # Debugging: Ensure logger is set
    Rails.logger = Logger.new(STDOUT)
    Rails.logger.warn "Logger has been set in application.rb"
  end
end
