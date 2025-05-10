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

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId ? Number(storedUserId) : null);
  }, []);


  const fetchNotifications = async () => {
    if (!userId) {
      setError("ログインが必要です");
      return;
    }

    try {
      setLoading(true);
      setError(null);


      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setError("認証情報が見つかりません");
        setLoading(false);
        return;
      }


      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };


      const postsResponse = await api.get(`/posts?user_id=${userId}`, config);
      const userPosts = postsResponse.data;


      if (!userPosts || userPosts.length === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }


      const allUsers = {};


      userPosts.forEach(post => {
        if (post.user && post.user.id && post.user.name) {
          allUsers[post.user.id] = post.user.name;
        }

        if (post.likes && post.likes.length > 0) {
          post.likes.forEach(like => {
            if (like.user && like.user.id && like.user.name) {
              allUsers[like.user.id] = like.user.name;
            }
          });
        }
      });

      let allNotifications = [];

      for (const post of userPosts) {
        if (post.user_id === userId && post.likes && post.likes.length > 0) {

          for (const like of post.likes) {
            try {
              const likeUserId = like.user_id;

              if (likeUserId === userId) {
                continue;
              }

              let userName = "ユーザー";

              if (like.user && like.user.name) {
                userName = like.user.name;
              }

              else if (allUsers[likeUserId]) {
                userName = allUsers[likeUserId];
              }

              else {
                try {

                  const userResponse = await api.get(`/users/${likeUserId}`, config);

                  if (userResponse.data && userResponse.data.name) {
                    userName = userResponse.data.name;
                    allUsers[likeUserId] = userName;
                  }
                } catch (userErr) {
                  console.error(`ユーザー情報の取得中にエラーが発生しました (ID: ${likeUserId}):`, userErr);
                }
              }

              const postContent = post.content 
                ? post.content.substring(0, 20) + (post.content.length > 20 ? '...' : '')
                : "投稿内容なし";

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
              console.error('いいね通知の処理中にエラーが発生しました:', err);
            }
          }
        }
      }

      allNotifications.sort((a, b) => b.created_at - a.created_at);
      setNotifications(allNotifications);
    } catch (err) {
      setError(`通知の取得に失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchNotifications();
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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

  const renderLoadingContent = () => (
    <div className="notification-loading">
      通知を読み込み中...
    </div>
  );


  const renderErrorContent = () => (
    <div className="notification-error">
      {error}
    </div>
  );


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
                さんがあなたの投稿に「いいね」しました
              </p>
              <p className="notification-post-content">&ldquo;{notification.post_content}&rdquo;</p>
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