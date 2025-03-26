import React, { useState, useEffect } from "react";
import { PiBellRinging } from "react-icons/pi";
import axios from "axios";
import "./styles/Notifications.css";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const NotificationsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // ログイン状態の確認とユーザーIDの取得
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId ? Number(storedUserId) : null);
  }, []);

  // モーダルを開いたときに通知を取得
  const fetchNotifications = async () => {
    if (!userId) {
      setError("ログインが必要です");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // JWTトークンを取得
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setError("認証情報が見つかりません");
        setLoading(false);
        return;
      }

      // ヘッダーにトークンを設定
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };

      // まず自分の投稿を取得（他の人の投稿へのいいねは含まない）
      console.log(`自分の投稿を取得中... ユーザーID: ${userId}`);
      const postsResponse = await api.get(`/posts?user_id=${userId}`, config);
      const userPosts = postsResponse.data;
      console.log(`取得した投稿数: ${userPosts?.length || 0}`);

      // 投稿がない場合
      if (!userPosts || userPosts.length === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      // 全ユーザーの情報をマッピング（投稿データから取得）
      const allUsers = {};
      
      // 投稿内のユーザー情報を収集
      userPosts.forEach(post => {
        // 投稿のユーザー情報があれば保存
        if (post.user && post.user.id && post.user.name) {
          allUsers[post.user.id] = post.user.name;
        }
        
        // 投稿のいいねにユーザー情報があれば保存
        if (post.likes && post.likes.length > 0) {
          post.likes.forEach(like => {
            if (like.user && like.user.id && like.user.name) {
              allUsers[like.user.id] = like.user.name;
            }
          });
        }
      });
      
      // ユーザー一覧をコンソールに出力（デバッグ用）
      console.log("収集したユーザー情報:", allUsers);

      // いいね通知データを収集
      let allNotifications = [];

      // 各投稿のいいね情報を処理
      for (const post of userPosts) {
        if (post.likes && post.likes.length > 0) {
          console.log(`投稿ID: ${post.id} には ${post.likes.length} 件のいいねがあります`);

          // 各いいねを処理
          for (const like of post.likes) {
            try {
              const likeUserId = like.user_id;
              
              // 自分のいいねは除外
              if (likeUserId === userId) {
                console.log(`自分のいいねなのでスキップします。いいねID: ${like.id}`);
                continue;
              }

              // いいね情報からユーザー名を取得する処理
              // 1. いいねのuser属性から（APIによってはここにユーザー情報が含まれる）
              // 2. 事前に収集したユーザーマップから
              // 3. 上記がない場合は「ユーザー」と表示
              let userName = "ユーザー";
              
              // いいねオブジェクト内にユーザー情報があるか確認
              if (like.user && like.user.name) {
                userName = like.user.name;
              } 
              // 事前に収集したユーザー情報から取得
              else if (allUsers[likeUserId]) {
                userName = allUsers[likeUserId];
              }
              // バックアップとして別のAPIを試す（上記の方法で取得できなかった場合）
              else {
                try {
                  console.log(`ユーザー情報をAPIから取得... ユーザーID: ${likeUserId}`);
                  
                  // ユーザー情報APIを呼び出し
                  const userResponse = await api.get(`/users/${likeUserId}`, config);
                  console.log("ユーザーAPI応答:", userResponse.data);
                  
                  // APIレスポンスにnameプロパティがあれば使用
                  if (userResponse.data && userResponse.data.name) {
                    userName = userResponse.data.name;
                    allUsers[likeUserId] = userName; // キャッシュに保存
                  }
                } catch (userErr) {
                  console.error(`ユーザーID ${likeUserId} の情報取得に失敗:`, userErr);
                }
              }

              // 投稿内容を抽出
              const postContent = post.content 
                ? post.content.substring(0, 20) + (post.content.length > 20 ? '...' : '')
                : "投稿内容なし";

              // 通知オブジェクトを作成
              const notification = {
                id: like.id,
                post_id: post.id,
                post_content: postContent,
                user_id: likeUserId,
                user_name: userName,
                created_at: new Date(like.created_at || post.created_at)
              };

              allNotifications.push(notification);
            } catch (err) {
              console.error("いいね情報の処理中にエラー:", err);
            }
          }
        }
      }

      // 日付順に並べ替え（新しいものが上）
      allNotifications.sort((a, b) => b.created_at - a.created_at);
      
      setNotifications(allNotifications);
      console.log("設定された通知:", allNotifications);
    } catch (err) {
      console.error("通知の取得に失敗しました:", err);
      setError(`通知の取得に失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // モーダルを開く
  const openModal = () => {
    setIsOpen(true);
    fetchNotifications();
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsOpen(false);
  };

  // 日付をフォーマットする
  const formatDate = (date) => {
    if (!date) return "不明な日時";
    
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "日付の形式が不正";
    }
    
    return d.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // 通知が読み込み中の表示
  const renderLoadingContent = () => (
    <div className="notification-loading">
      通知を読み込み中...
    </div>
  );

  // エラー表示
  const renderErrorContent = () => (
    <div className="notification-error">
      {error}
    </div>
  );

  // 通知リストの表示
  const renderNotifications = () => {
    if (notifications.length === 0) {
      return (
        <div className="notification-empty">
          <p>いいね通知はありません</p>
        </div>
      );
    }

    return (
      <ul className="notification-list">
        {notifications.map((notification) => (
          <li key={notification.id || Math.random().toString()} className="notification-item">
            <div className="notification-icon">❤️</div>
            <div className="notification-content">
              <p className="notification-text">
                <span className="notification-user">
                  {notification.user_name || "ユーザー"}
                </span>
                さんが投稿に「いいね」しました
              </p>
              <p className="notification-post-content">"{notification.post_content}"</p>
              <p className="notification-time">{formatDate(notification.created_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="notifications-container">
      {/* ベルアイコン */}
      <button
        className="notification-bell-button"
        onClick={openModal}
        title="通知を表示"
      >
        <PiBellRinging className="notification-bell-icon" />
      </button>

      {/* モーダルウィンドウ */}
      {isOpen && (
        <div className="notification-modal-overlay">
          <div className="notification-modal">
            <div className="notification-modal-header">
              <h3>通知一覧</h3>
              <button
                className="notification-close-button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="notification-modal-content">
              {loading
                ? renderLoadingContent()
                : error
                ? renderErrorContent()
                : renderNotifications()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsModal;