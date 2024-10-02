import { useEffect, useState } from "react";
import { auth, db } from "./firebase"; // Firebaseのauthとdbをインポート
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (currentUser) {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("userId", "==", currentUser.uid)); // 自分の投稿のみ取得
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // createdAtでソート（新しい投稿が上になるように）
        postsList.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        setUserPosts(postsList);
      }
    };

    fetchUserPosts();
  }, [currentUser]);

  return (
    <div className="profile-container">
      <h1>プロフィール</h1>
      {currentUser && (
        <div>
          <h2>{currentUser.displayName || currentUser.email}</h2>
          <Link to="/">
            <button>ホームに戻る</button>
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
