import { useEffect, useState } from "react";
import { auth, db } from "./firebase"; // Firebaseのauthとdbをインポート
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const currentUser = auth.currentUser;

  // usersコレクションからユーザー名とプロフィール文を取得
  const fetchUsernamesAndProfileTexts = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersMap = {}; // ユーザーIDをキーにユーザー名とプロフィール文をマッピング

    usersSnapshot.docs.forEach((doc) => {
      const userData = doc.data();
      usersMap[doc.id] = {
        username: userData.username,
        profileText: userData.text || "", // プロフィール文を取得（存在しない場合は空文字）
      };
    });

    setUserInfo(usersMap); // ユーザー情報をステートに保存
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (currentUser) {
        // ユーザー情報の取得
        await fetchUsernamesAndProfileTexts();

        // ユーザーの投稿を取得
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("userId", "==", currentUser.uid));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        postsList.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        setUserPosts(postsList);
      }
    };

    fetchUserPosts();
  }, [currentUser]);

  return (
    <div className="profile-container">
      <h1 className="page-title">プロフィール</h1>
      {currentUser && userInfo[currentUser.uid] && (
        <div>
          <div className="user-info">
            <img src="images/user_icon.png" alt="user-icon" id="user-icon" />
            <h2 id="user-name">
              {userInfo[currentUser.uid].username || currentUser.email}
            </h2>
          </div>
          {/* プロフィール文を表示 */}
          <p id="status-message">
            {userInfo[currentUser.uid].profileText}
          </p>{" "}
          <div className="buttons">
            <Link to="/">
              <button>ホームに戻る</button>
            </Link>
            <Link
              to="/edit-profile"
              id="profile-edit-button"
              className="edit-button"
            >
              <button>編集</button>
            </Link>
          </div>
        </div>
      )}

      <h2 id="your-posts">あなたの投稿</h2>
      <div className="posts-container">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-user-info">
                <img
                  id="user-image"
                  src="images/user_icon.png"
                  alt="user-icon"
                />
                <h3 id="post-user-name">
                  {userInfo[post.userId]?.username || "Unknown"}
                </h3>
                <p id="post-created-at">
                  {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>投稿がありません。</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
