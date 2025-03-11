import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likesCount, setLikesCount] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 6;
  
  const navigate = useNavigate();
  
  // ユーザー情報の取得
  const getCurrentUser = () => {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  };
  
  const currentUser = getCurrentUser();
  
  // 投稿データの取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        // ヘッダーにJWTトークンを設定
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        const response = await axios.get("/posts", config);
        setPosts(response.data);
        
        // いいね数の初期設定
        const initialLikesCount = {};
        response.data.forEach(post => {
          initialLikesCount[post.id] = post.likes.length;
        });
        setLikesCount(initialLikesCount);
        
        setIsLoading(false);
      } catch (err) {
        console.error("投稿の取得に失敗しました", err);
        setError("投稿の取得に失敗しました。再度お試しください。");
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // いいね機能の処理
  const handleLike = async (postId) => {
    if (!currentUser) {
      alert("いいねするにはログインが必要です");
      navigate("/login");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post(`/posts/${postId}/likes`, {}, config);
      
      // 投稿のいいね状態を更新
      setLikesCount(prev => ({
        ...prev,
        [postId]: response.data.likes_count
      }));
      
      // 投稿一覧のいいね情報も更新
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const userLiked = response.data.liked;
            const updatedLikes = userLiked 
              ? [...post.likes, { user_id: currentUser.id }]
              : post.likes.filter(like => like.user_id !== currentUser.id);
              
            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("いいねの処理に失敗しました", err);
      alert("いいねの処理に失敗しました。再度お試しください。");
    }
  };
  
  // 新規投稿の作成
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("投稿するにはログインが必要です");
      navigate("/login");
      return;
    }
    
    if (!newPostContent.trim()) {
      alert("投稿内容を入力してください");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post("/posts", { 
        post: { content: newPostContent } 
      }, config);
      
      // 新しい投稿を追加
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setNewPostContent("");
      
      // いいね数も更新
      setLikesCount(prev => ({
        ...prev,
        [response.data.id]: 0
      }));
    } catch (err) {
      console.error("投稿の作成に失敗しました", err);
      alert("投稿の作成に失敗しました。再度お試しください。");
    }
  };
  
  // 検索機能
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 検索時は1ページ目に戻す
  };
  
  // フィルタリングされた投稿
  const filteredPosts = posts.filter(post => 
    post.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ページネーション
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // ページ変更ハンドラー
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ユーザーが投稿にいいねしているかチェック
  const hasUserLiked = (post) => {
    if (!currentUser) return false;
    return post.likes.some(like => like.user_id === currentUser.id);
  };
  
  // 日付フォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  if (isLoading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="posts-container">
      <h1>みんなの投稿一覧</h1>
      
      {/* 投稿フォーム */}
      {currentUser && (
        <div className="post-form-container">
          <form onSubmit={handleSubmitPost} className="post-form">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="あなたの近況を投稿しよう..."
              className="post-textarea"
            />
            <button type="submit" className="post-button">投稿する</button>
          </form>
        </div>
      )}
      
      {/* 検索とハートカウント */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="ユーザー名で検索"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">検索</button>
        </div>
        <div className="heart-count">
          ❤️をもらった累計数：{Object.values(likesCount).reduce((a, b) => a + b, 0)}
        </div>
      </div>
      
      {/* 投稿一覧 */}
      <div className="posts-grid">
        {currentPosts.map(post => (
          <div key={post.id} className="post-card">
            <h2 className="post-title">タイトル：テスト{post.id}</h2>
            <p className="post-date">投稿日：{formatDate(post.created_at)}</p>
            <p className="post-author">ユーザー名：{post.user.name}</p>
            <p className="post-content">{post.content}</p>
            <button 
              className={`like-button ${hasUserLiked(post) ? 'liked' : ''}`}
              onClick={() => handleLike(post.id)}
            >
              {hasUserLiked(post) ? '❤️' : '♡'}
            </button>
          </div>
        ))}
      </div>
      
      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            ◀
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-arrow"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;