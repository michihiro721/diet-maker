import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Posts.css";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [likesCount, setLikesCount] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  
  const postsPerPage = 6;

  // ユーザー情報の取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await api.get("/users/1", config); // ユーザーIDが1でない場合は調整してください
        setCurrentUser(response.data);
        console.log("ログインユーザー情報:", response.data);
      } catch (err) {
        console.error("ユーザー情報の取得に失敗しました", err);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // 投稿データの取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("投稿データを取得中...");
        setLoading(true);
        
        // ローカルストレージからトークンを取得
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        console.log("リクエスト設定:", { url: "/posts", config });
        
        const response = await api.get("/posts", config);
        console.log("取得したデータ:", response.data);
        setPosts(response.data);
        
        // いいね数の初期設定
        const initialLikesCount = {};
        response.data.forEach(post => {
          initialLikesCount[post.id] = post.likes?.length || 0;
        });
        setLikesCount(initialLikesCount);
        
        setLoading(false);
      } catch (err) {
        console.error("投稿の取得に失敗しました", err);
        console.error("エラー詳細:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        });
        setError(`エラー: ${err.message}. ステータス: ${err.response?.status || 'N/A'}`);
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // いいね機能の処理
  const handleLike = async (postId) => {
    if (!currentUser) {
      alert("いいねするにはログインが必要です");
      return;
    }
    
    try {
      console.log("いいねリクエスト送信中:", { postId, userId: currentUser.id || 1 });
      
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await api.post(`/posts/${postId}/likes`, {}, config);
      console.log("いいね結果:", response.data);
      
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
            const userId = currentUser.id || 1; // IDがない場合はデフォルト値を使用
            
            const updatedLikes = userLiked 
              ? [...(post.likes || []), { user_id: userId }]
              : (post.likes || []).filter(like => like.user_id !== userId);
              
            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("いいねの処理に失敗しました", err);
      console.error("いいねエラー詳細:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      alert("いいねの処理に失敗しました。再度お試しください。");
    }
  };

  // 検索機能
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 検索時は1ページ目に戻す
  };
  
  // フィルタリングされた投稿
  const filteredPosts = posts.filter(post => 
    post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const userId = currentUser.id || 1; // IDがない場合はデフォルト値を使用
    return post.likes?.some(like => like.user_id === userId);
  };

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="posts-container">
      <h1>みんなの投稿一覧</h1>
      
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
      {posts.length === 0 ? (
        <p className="no-posts">投稿がありません</p>
      ) : (
        <div className="posts-grid">
          {currentPosts.map(post => (
            <div key={post.id} className="post-card">
              <h2 className="post-title">タイトル：テスト{post.id}</h2>
              <p className="post-date">投稿日：{new Date(post.created_at).toLocaleDateString("ja-JP")}</p>
              <p className="post-author">ユーザー名：{post.user?.name || "不明なユーザー"}</p>
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
      )}
      
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