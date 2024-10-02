import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"; // Link と useNavigate のインポート
import { auth } from "./firebase"; // Firebaseの認証機能をインポート
//import "./Login.css"; // スタイルのインポート

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // ログイン後、ホーム画面へ遷移
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>ログイン</button>

      {/* 新規登録ページへのリンク */}
      <p>
        アカウントをお持ちでないですか？ <Link to="/signup">新規登録</Link>
      </p>
    </div>
  );
};

export default Login;
