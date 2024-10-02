import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase"; // Firebase AuthenticationとFirestoreをインポート
import { Link, useNavigate } from "react-router-dom"; // ページ遷移用
import "./Signup.css"; // スタイルのインポート

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profileText, setProfileText] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        text: profileText,
        following_userid: [], // フォローしているユーザーはいない初期値
      });

      console.log("User registered and data saved to Firestore");

      // 新規登録が完了したらホームページに遷移
      navigate("/");
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="title">新規登録</h2>

      <p className="text">ユーザー名</p>
      <input
        type="text"
        placeholder="User Name"
        onChange={(e) => setUsername(e.target.value)}
      />

      <p className="text">メールアドレス</p>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <p className="text">パスワード</p>
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <p className="text">ステータスメッセージ</p>
      <textarea
        placeholder="Status Message"
        onChange={(e) => setProfileText(e.target.value)}
      ></textarea>
      <button className="registrate-button" onClick={handleSignup}>
        新規登録
      </button>

      <Link to="/login">
        <p className="back">戻る</p>
      </Link>
    </div>
  );
};

export default Signup;
