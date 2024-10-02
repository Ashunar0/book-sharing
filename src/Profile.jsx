import { useEffect, useState } from "react";
import { auth, db } from "./firebase"; // Firebaseのauthとdbをインポート
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

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
      <h1>プロフィール</h1>
      {currentUser && userInfo[currentUser.uid] && (
        <div>
          <h2>{userInfo[currentUser.uid].username || currentUser.email}</h2>
          <p>{userInfo[currentUser.uid].profileText}</p>{" "}
          {/* プロフィール文を表示 */}
          <Link to="/">
            <button>ホームに戻る</button>
          </Link>
          <Link to="/edit-profile" className="edit-button">
            <button>編集</button>
          </Link>
        </div>
      )}

      <h2>あなたの投稿</h2>
      <div className="posts-container">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small className="created-at">
                {new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </small>
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
