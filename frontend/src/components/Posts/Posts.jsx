import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles/Posts.css";
import NotificationsModal from "./NotificationsModal";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLikesCount] = useState({});
  const [totalLikesCount, setTotalLikesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  const postsPerPage = 6;


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const jwt = localStorage.getItem('jwt');
    
    setUserId(storedUserId ? Number(storedUserId) : null);
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
  
  // いいねの合計を計算
  useEffect(() => {
    const calculateTotalLikes = () => {
      // ログインしていない場合は0を表示
      if (!isLoggedIn || !userId) {
        setTotalLikesCount(0);
        return;
      }
      

      const userIdNum = Number(userId);
      

      const myPosts = posts.filter(post => post.user_id === userIdNum);
      
      // 自分の投稿に対するいいね数を合計
      let total = 0;
      myPosts.forEach(post => {
        total += post.likes?.length || 0;
      });
      
      setTotalLikesCount(total);
    };
    
    calculateTotalLikes();
  }, [posts, isLoggedIn, userId]);
  
  // 投稿を削除する関数
  const handleDeletePost = async (postId, e) => {

    if (e) e.stopPropagation();
    
    if (!isLoggedIn) {
      alert("ログインが必要です");
      return;
    }
    
    // 削除確認
    if (!window.confirm("この投稿を削除してもよろしいですか？")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      

      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        setIsDeleting(false);
        return;
      }
      
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };
      

      await api.delete(`/posts/${postId}`, config);
      

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      console.log(`投稿ID ${postId} を削除しました`);
      setIsDeleting(false);
      
    } catch (err) {
      console.error("投稿の削除に失敗しました", err);
      
      setDeleteError(`削除に失敗しました: ${err.response?.data?.error || err.message}`);
      setIsDeleting(false);
      
      if (err.response?.status === 401) {
        alert("認証が切れました。再ログインしてください。");
      } else if (err.response?.status === 403) {
        alert("この投稿を削除する権限がありません。");
      } else {
        alert(`削除に失敗しました: ${err.message}`);
      }
    }
  };


  const getPostDate = (post) => {

    const newDateRegex = /【(\d{4}-\d{2}-\d{2})】/;
    const newDateMatch = post.content.match(newDateRegex);
    
    if (newDateMatch) {
      return newDateMatch[1];
    }
    
    const oldDateRegex1 = /(\d{4}-\d{2}-\d{2})のトレーニング成果/;
    const oldDateMatch1 = post.content.match(oldDateRegex1);
    
    if (oldDateMatch1) {
      return oldDateMatch1[1];
    }
    
    const oldDateRegex2 = /(\d{4}-\d{2}-\d{2})/;
    const oldDateMatch2 = post.content.match(oldDateRegex2);
    
    if (oldDateMatch2) {
      return oldDateMatch2[1];
    }
    

    return new Date(post.created_at).toLocaleDateString('en-CA');
  };

  // 投稿内容から日付マーカーと不要なテキストを削除する関数
  const getCleanPostContent = (post) => {
    if (!post || !post.content) return '';
    
    let content = post.content;
    

    content = content.replace(/【\d{4}-\d{2}-\d{2}】\s*/, '');
    
    return content.trim();
  };


  const handleLike = async (postId, e) => {

    if (e) e.stopPropagation();
    
    if (!isLoggedIn) {
      alert("いいねするにはログインが必要です");
      window.location.href = '/login';
      return;
    }
    
    try {
      console.log("いいねリクエスト送信中...");
      

      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        return;
      }
      
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };
      

      const response = await api.post(`/posts/${postId}/likes`, {}, config);
      console.log("いいねレスポンス:", response.data);
      

      const liked = response.data.liked;
      const likesCount = response.data.likes_count || 0;
      const userIdNum = Number(userId);
      
      // いいねの状態を更新
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
    setCurrentPage(1);
  };
  
  // フィルタリングされた投稿
  const filteredPosts = posts.filter(post => {

    const userName = post.user?.name || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // ページネーション
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // ページネーションの表示範囲を計算する
  const getPaginationRange = () => {
    // 表示数の制限 (スマホの場合)
    const isSmallScreen = window.innerWidth < 768;
    const maxDisplayCount = isSmallScreen ? 5 : 9;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayCount / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayCount - 1);
    

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxDisplayCount + 1);
    }
    
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  // ユーザーが投稿にいいねしているかチェック
  const hasUserLiked = (post) => {
    if (!isLoggedIn || !userId) return false;
    const userIdNum = Number(userId);
    return post.likes?.some(like => like.user_id === userIdNum);
  };

  // 自分の投稿かどうかをチェック
  const isMyPost = (post) => {
    if (!isLoggedIn || !userId) return false;
    return post.user_id === Number(userId);
  };

  // すべての投稿にトレーニング記録ボタンを表示するためにtrueを返す
  const hasAchievementData = () => {
    return true;
  };

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  

  const paginationRange = getPaginationRange();
  
  return (
    <div className="posts-container">
      <div className="search-container-centered">
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
          {isLoggedIn && <NotificationsModal />}
        </div>
      </div>
      
      {deleteError && (
        <div className="delete-error">{deleteError}</div>
      )}
      
      {/* 投稿一覧 */}
      {posts.length === 0 ? (
        <p className="no-posts">投稿がありません</p>
      ) : (
        <div className="posts-grid">
          {currentPosts.map(post => (
            <div key={post.id} className="post-card">
              {/* 自分の投稿の場合は削除ボタンを表示 */}
              {isMyPost(post) && (
                <button 
                  className="delete-post-button"
                  onClick={(e) => handleDeletePost(post.id, e)}
                  disabled={isDeleting}
                  title="投稿を削除"
                >
                  ×
                </button>
              )}

              {/* トレーニング記録ボタン */}
              {hasAchievementData() && (
                <div className="training-record-button-container">
                  <Link 
                    to={`/training-details/${post.id}?date=${getPostDate(post)}`}
                    className="view-achievement-button"
                    title="トレーニング記録を見る"
                  >
                    トレーニング記録
                  </Link>
                </div>
              )}

              <div className="post-info">
                <p className="post-date">
                  投稿日：{new Date(post.created_at).toLocaleDateString("ja-JP")}
                  {getPostDate(post) && <span className="training-date"> 【トレーニング日】：{getPostDate(post)}</span>}
                </p>
                <p className="post-author">ユーザー名：{post.user?.name || "不明なユーザー"}</p>
              </div>
              
              <p className="post-content">{getCleanPostContent(post)}</p>
              
              <button 
                className={`like-button ${hasUserLiked(post) ? 'liked' : ''}`}
                onClick={(e) => handleLike(post.id, e)}
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