import { useState } from "react";
import { db } from "./firebase"; // Firestoreのインポート
import { collection, addDoc } from "firebase/firestore";
import { auth } from "./firebase"; // Firebase authをインポート
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser; // 現在のユーザーを取得
      await addDoc(collection(db, "posts"), {
        title,
        content,
        createdAt: new Date(),
        userId: currentUser.uid, // ユーザーIDを保存
      });
      navigate("/"); // 投稿作成後にホーム画面へ遷移
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div className="create-post-container">
      <h1>投稿作成</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">タイトル:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">内容:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">投稿</button>
      </form>
    </div>
  );
};

export default CreatePost;
