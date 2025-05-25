class HomeController < ActionController::Base
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  before_action :set_default_ogp
  
  def index
    set_default_ogp
    render layout: 'application'
  end
  
  def show_training
    @training_id = params[:id]
    @date = params[:date]

    set_training_ogp
    render layout: 'application'
  end
  
  def show_post
    @post_id = params[:id]
    
    begin
      @post = Post.find_by(id: @post_id)
      if @post
        set_post_ogp
      else
        set_default_ogp
      end
    rescue => e
      Rails.logger.error "Post not found: #{e.message}"
      set_default_ogp
    end
    
    render layout: 'application'
  end
  
  private
  
  def set_default_ogp
    @page_title = "ダイエットメーカー"
    @og_title = "ダイエットメーカー"
    @og_description = "トレーニングメニューの提案や記録ができたり、ダイエットをサポートするアプリ"
    @og_image = "#{request.protocol}#{request.host_with_port}/default-ogp.jpg"
    @og_type = "website"
    @og_url = request.original_url
  end
  
  def set_training_ogp
    begin
      formatted_date = @date ? Date.parse(@date).strftime("%Y年%m月%d日") : "今日"
      @page_title = "#{formatted_date}のトレーニング記録 - ダイエットメーカー"
      @og_title = "#{formatted_date}のトレーニング記録"
      @og_description = "ダイエットメーカーでのトレーニング記録をチェック！継続的な健康管理をサポートします。"
      @og_image = "#{request.protocol}#{request.host_with_port}/post-ogp.jpg"
      @og_type = "article"
      @og_url = request.original_url
    rescue => e
      Rails.logger.error "Date parse error: #{e.message}"

      @page_title = "トレーニング記録 - ダイエットメーカー"
      @og_title = "トレーニング記録"
      @og_description = "ダイエットメーカーでのトレーニング記録をチェック！"
      @og_image = "#{request.protocol}#{request.host_with_port}/post-ogp.jpg"
      @og_type = "article"
      @og_url = request.original_url
    end
  end
  
  def set_post_ogp
    if @post && @post.user
      @page_title = "#{@post.user.name}さんの投稿 - ダイエットメーカー"
      @og_title = "#{@post.user.name}さんの投稿"
      @og_description = @post.content.present? ? @post.content.truncate(300) : "ダイエットメーカーでの投稿をチェック！"
      @og_image = "#{request.protocol}#{request.host_with_port}/post-ogp.jpg"
      @og_type = "article"
      @og_url = request.original_url
    else
      set_default_ogp
    end
  end
end