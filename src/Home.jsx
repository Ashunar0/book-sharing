import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Firestoreのインスタンスをインポート
//import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  // Firestoreから投稿を取得
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };
    fetchPosts();
  }, []);

  // 日付をフォーマットする関数
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // FirestoreのtimestampをDateに変換
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <body>
      <div>
        <h1>タイムライン</h1>
        <div className="timeline">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {/* createdAtが存在する場合のみ表示 */}
              {post.createdAt && (
                <span className="created-at">
                  作成日時: {formatDate(post.createdAt)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </body>
  );
};

export default Home;
