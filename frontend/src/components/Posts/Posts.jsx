import React, { useState, useEffect } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("投稿データを取得中...");
        setLoading(true);
        
        // ローカルストレージからトークンを取得
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        // リクエストのURLと設定をログに出力
        console.log("リクエスト設定:", { url: "/posts", config });
        
        const response = await axios.get("/posts", config);
        console.log("取得したデータ:", response.data);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("投稿の取得に失敗しました", err);
        console.error("エラー詳細:", err.response?.data || "詳細なし");
        setError(`エラー: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>みんなの投稿一覧</h1>
      {posts.length === 0 ? (
        <p>投稿がありません</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ 
              marginBottom: "20px", 
              padding: "15px", 
              border: "1px solid #ddd",
              borderRadius: "8px" 
            }}>
              <p style={{ fontWeight: "bold" }}>投稿者: {post.user?.name || "不明なユーザー"}</p>
              <p style={{ margin: "10px 0" }}>{post.content}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>投稿日: {new Date(post.created_at).toLocaleDateString("ja-JP")}</p>
                <p>❤️ {post.likes?.length || 0}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Posts;