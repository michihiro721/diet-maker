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
  const [totalLikesCount, setTotalLikesCount] = useState(0);
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
  
  // いいねの合計を計算するための useEffect
  useEffect(() => {
    const calculateTotalLikes = () => {
      // ログインしていない場合は0を表示
      if (!isLoggedIn || !userId) {
        setTotalLikesCount(0);
        return;
      }
      
      // ユーザーIDを数値に変換
      const userIdNum = Number(userId);
      
      // 自分の投稿のみ抽出（直接投稿のuser_idと比較）
      const myPosts = posts.filter(post => post.user_id === userIdNum);
      
      // 自分の投稿に対するいいね数を合計
      let total = 0;
      myPosts.forEach(post => {
        total += post.likes?.length || 0;
      });
      
      console.log('いいね数計算:', {
        userIdNum,
        myPostsCount: myPosts.length,
        myPostIds: myPosts.map(p => p.id),
        allPostUserIds: posts.map(p => p.user_id),
        postUserProperties: posts.map(p => Object.keys(p)),
        likesOnMyPosts: myPosts.map(p => p.likes?.length || 0),
        totalLikes: total
      });
      
      setTotalLikesCount(total);
    };
    
    calculateTotalLikes();
  }, [posts, isLoggedIn, userId]);
  
  // いいね機能の処理
  const handleLike = async (postId) => {
    if (!isLoggedIn) {
      alert("いいねするにはログインが必要です");
      window.location.href = '/login'; // ログインページへリダイレクト
      return;
    }
    
    try {
      console.log("いいねリクエスト送信中...");
      
      // トークンを取得
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        return;
      }
      
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };
      
      // リクエスト送信
      const response = await api.post(`/posts/${postId}/likes`, {}, config);
      console.log("いいねレスポンス:", response.data);
      
      // レスポンスデータから必要な情報を取得
      const liked = response.data.liked;
      const likesCount = response.data.likes_count || 0;
      const userIdNum = Number(userId);
      
      // 投稿の状態を更新
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            let updatedLikes;
            
            // いいねの状態によって処理を分ける
            if (liked) {
              // いいねが追加された場合
              updatedLikes = [...(post.likes || []), { user_id: userIdNum }];
            } else {
              // いいねが削除された場合
              updatedLikes = (post.likes || []).filter(like => like.user_id !== userIdNum);
            }
            
            // 投稿を更新
            return {
              ...post,
              likes: updatedLikes
            };
          }
          return post;
        })
      );
      
      // 個別投稿のいいね数を更新
      setLikesCount(prev => ({
        ...prev,
        [postId]: likesCount
      }));
      
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
  const filteredPosts = posts.filter(post => {
    // userがundefinedの場合も考慮
    const userName = post.user?.name || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
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
  
  // ページネーションの表示範囲を計算する
  const getPaginationRange = () => {
    // 表示数の制限 (スマホの場合はさらに少なくなる)
    const isSmallScreen = window.innerWidth < 768;
    const maxDisplayCount = isSmallScreen ? 5 : 9;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayCount / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayCount - 1);
    
    // startPageの調整（endPageが最大値に達している場合）
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxDisplayCount + 1);
    }
    
    // 範囲を配列として返す
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  // ユーザーが投稿にいいねしているかチェック
  const hasUserLiked = (post) => {
    if (!isLoggedIn || !userId) return false;
    const userIdNum = Number(userId);
    return post.likes?.some(like => like.user_id === userIdNum);
  };

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  
  // ページネーションの表示範囲
  const paginationRange = getPaginationRange();
  
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
          ❤️をもらった累計数：{totalLikesCount}
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
      
      {/* ページネーション - 改良版 */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* 最初のページへ */}
          {currentPage > 3 && (
            <button 
              onClick={() => handlePageChange(1)}
              className="pagination-arrow pagination-end"
              title="最初のページへ"
            >
              «
            </button>
          )}
          
          {/* 前のページへ */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-arrow"
            title="前のページへ"
          >
            ◀
          </button>
          
          {/* ページ番号 */}
          {paginationRange.map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
            >
              {pageNumber}
            </button>
          ))}
          
          {/* 次のページへ */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-arrow"
            title="次のページへ"
          >
            ▶
          </button>
          
          {/* 最後のページへ */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <button 
              onClick={() => handlePageChange(totalPages)}
              className="pagination-arrow pagination-end"
              title="最後のページへ"
            >
              »
            </button>
          )}
          
          {/* ページ表示情報 */}
          <div className="pagination-info">
            {currentPage} / {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;