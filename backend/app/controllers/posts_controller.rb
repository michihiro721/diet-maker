class PostsController < ApplicationController
  before_action :authenticate_user!, except: [ :index, :show ]
  before_action :set_post, only: [ :show, :update, :destroy ]


  def index
    @posts = Post.includes(:user, :likes).order(created_at: :desc)
    render json: @posts, include: [
      :user,
      likes: { include: :user }
    ]
  end


  def show
    render json: @post, include: [
      :user,
      comments: { include: :user },
      likes: { include: :user }
    ]
  end


  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      render json: @post, include: [ :user ], status: :created
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end


  def update
    if @post.user_id == current_user.id && @post.update(post_params)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    if @post.user_id == current_user.id
      @post.destroy
      render json: { message: "削除しました" }
    else
      render json: { error: "投稿の削除権限がありません" }, status: :forbidden
    end
  end

  private

    def set_post
      @post = Post.find(params[:id])
    end


    def post_params
      params.require(:post).permit(:content)
    end
end
