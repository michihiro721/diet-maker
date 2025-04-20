class LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [ :create ]


  def create
    like = @post.likes.find_by(user_id: current_user.id)

    if like
      like.destroy
      render json: { liked: false, likes_count: @post.likes.count }
    else
      like = @post.likes.build(user_id: current_user.id)
      if like.save
        render json: { liked: true, likes_count: @post.likes.count }
      else
        render json: like.errors, status: :unprocessable_entity
      end
    end
  end

  private
    def set_post
      @post = Post.find(params[:post_id])
    end
end
