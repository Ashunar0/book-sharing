import { useEffect, useState } from "react";
import { auth, db } from "./firebase"; // Firebaseのauthとdbをインポート
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./Home2.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({}); // ユーザー名を保持する状態を追加

  useEffect(() => {
    // Firestoreから投稿データを取得
    const fetchPosts = async () => {
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const postsList = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // createdAtでソート（新しい投稿が上になるように）
      postsList.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      setPosts(postsList);
    };

    // usersコレクションからユーザー名を取得
    const fetchUsernames = async () => {
      const usernamesSnapshot = await getDocs(collection(db, "users"));
      const usernamesMap = {};
      usernamesSnapshot.docs.forEach((doc) => {
        usernamesMap[doc.id] = doc.data().username; // ユーザーIDをキーにユーザー名をマッピング
      });
      setUsernames(usernamesMap);
    };

    fetchPosts();
    fetchUsernames();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="home-container">
      <div className="main-container">
        <div className="sidebar">
          <div className="title-and-icon">
            <img id="icon" src="images/icon.png" alt="icon" />
            <h2 id="title">Book-Sharing</h2>
          </div>
          <div className="user-profile-info">
            <img
              src="images/user_icon.png"
              alt="user-icon"
              id="user-profile-icon"
            />
            {/* ユーザー名の表示 */}
            {auth.currentUser && (
              <h2 id="user-name">
                {usernames[auth.currentUser.uid] || auth.currentUser.email}
              </h2>
            )}
          </div>
          <div className="sidebar-buttons">
            <Link to="/profile">
              <button className="sidebar-button">プロフィール</button>
            </Link>
            <Link to="/create-post">
              <button className="sidebar-button">投稿作成</button>
            </Link>
            <Link to="/login">
              <button className="sidebar-button" onClick={handleLogout}>
                ログアウト
              </button>
            </Link>
          </div>
        </div>

        <div className="timeline">
          <h2 className="page-title">タイムライン</h2>

          {/* 投稿の表示 */}
          <div className="posts-container">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <div className="post-user-info">
                  <img
                    id="user-image"
                    src="images/user_icon.png"
                    alt="user-icon"
                  />
                  <h3 id="post-user-name">
                    {usernames[post.userId] || "Unknown"}
                  </h3>
                  <p id="post-created-at">
                    {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                </div>
                <h3 id="post-title">{post.title}</h3>
                <h4 id="post-content">{post.content}</h4>
                <div className="responces">
                  <img
                    src="images/icons/reply.png"
                    alt="reply_icon"
                    className="responce-icon"
                    id="reply"
                  />
                  <p className="responce-count" id="reply-count">
                    0
                  </p>
                  <img
                    src="images/icons/favorite.png"
                    alt="like_icon"
                    className="responce-icon"
                    id="like"
                  />
                  <p className="responce-count" id="like-count">
                    0
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
