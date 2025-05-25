class HomeController < ActionController::Base
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  before_action :set_ogp_data
  
  def index
    set_default_ogp
    render layout: 'application'
  end
  
  def show_post
    @post = Post.find_by(id: params[:id])
    if @post
      set_post_ogp
    else
      set_default_ogp
    end
    
    render layout: 'application'
  end
  
  private
  
  def set_default_ogp
    @page_title = "ダイエットメーカー"
    @og_title = "ダイエットメーカー"
    @og_description = "トレーニングの管理と記録をサポートする「ダイエットメーカー」"

    @og_image = "#{request.protocol}#{request.host_with_port}/default-ogp.jpg"
    @og_type = "website"
  end
  
  def set_post_ogp
    @page_title = "#{@post.user.name}さんの投稿 - ダイエットメーカー"
    @og_title = "#{@post.user.name}さんの投稿"
    @og_description = @post.content.length > 300 ? "#{@post.content[0..300]}..." : @post.content

    @og_image = "#{request.protocol}#{request.host_with_port}/post-ogp.jpg"
    @og_type = "article"
  end
  
  def set_ogp_data
    set_default_ogp
  end
end