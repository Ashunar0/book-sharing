import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"; // Link と useNavigate のインポート
import { auth } from "./firebase"; // Firebaseの認証機能をインポート
import "./Login2.css"; // スタイルのインポート

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //ログインの処理をする関数
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ログイン処理
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // ログイン成功後にホーム画面へ遷移
    } catch {
      // 認証エラーが発生した場合
      setError("メールアドレスまたはパスワードが正しくありません。");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ログイン</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">ログイン</button>
        </form>

        {/* エラーメッセージの表示 */}
        {error && <p className="error-message">{error}</p>}

        <div className="sign-up-text">
          <p className="sign-up">はじめてご利用になる場合は</p>

          {/* 新規登録ページへのリンク */}
          <p>
            <Link className="sign-up" to="/signup">
              サインアップ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
