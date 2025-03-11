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
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const postsPerPage = 6;

  // ログイン状態の確認
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const jwt = localStorage.getItem('jwt');
    
    setUserId(storedUserId);
    setIsLoggedIn(!!storedUserId && !!jwt);
    
    console.log('認証情報:', { userId: storedUserId, jwt: jwt ? '取得済み' : 'なし' });
  }, []);

  // 投稿データの取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("投稿データを取得中...");
        setLoading(true);
        
        const response = await api.get("/posts");
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
    if (!isLoggedIn) {
      alert("いいねするにはログインが必要です");
      window.location.href = '/login'; // ログインページへリダイレクト
      return;
    }
    
    try {
      console.log("いいねリクエスト送信中...");
      
      // TrainingRecordと同じ方法でトークンを取得
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        return;
      }
      
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };
      
      console.log("リクエスト設定:", {
        url: `/posts/${postId}/likes`,
        headers: config.headers
      });
      
      const response = await api.post(`/posts/${postId}/likes`, {}, config);
      console.log("いいねレスポンス:", response.data);
      
      // 投稿のいいね状態を更新
      setLikesCount(prev => ({
        ...prev,
        [postId]: response.data.likes_count || prev[postId]
      }));
      
      // 投稿一覧のいいね情報も更新
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const userLiked = response.data.liked;
            
            // いいねが追加または削除された場合の処理
            if (userLiked) {
              // いいねが追加された場合
              return {
                ...post,
                likes: [...(post.likes || []), { user_id: parseInt(userId) }]
              };
            } else {
              // いいねが削除された場合
              return {
                ...post,
                likes: (post.likes || []).filter(like => like.user_id !== parseInt(userId))
              };
            }
          }
          return post;
        })
      );
    } catch (err) {
      console.error("いいねの処理に失敗しました", err);
      console.error("エラーの詳細:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.response?.status === 401) {
        alert("認証が切れました。再ログインしてください。");
      } else {
        alert(`いいねの処理に失敗しました: ${err.message}`);
      }
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
    if (!isLoggedIn || !userId) return false;
    return post.likes?.some(like => like.user_id === parseInt(userId));
  };

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="posts-container">
      <h1></h1>
      
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
      
      {/* ログインしていない場合のメッセージ */}
      {!isLoggedIn && (
        <div className="login-message">
          <p>いいねするにはログインが必要です。</p>
          <a href="/login" className="login-link">ログインする</a>
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