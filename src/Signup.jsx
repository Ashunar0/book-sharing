import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase"; // Firebase AuthenticationとFirestoreをインポート
import { useNavigate } from "react-router-dom"; // ページ遷移用
//import "./Signup.css"; // スタイルのインポート

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
      <h2>新規登録</h2>
      <input
        type="text"
        placeholder="ユーザー名"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="メールアドレス"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        onChange={(e) => setPassword(e.target.value)}
      />
      <textarea
        placeholder="プロフィール文"
        onChange={(e) => setProfileText(e.target.value)}
      ></textarea>
      <button onClick={handleSignup}>新規登録</button>
    </div>
  );
};

export default Signup;
