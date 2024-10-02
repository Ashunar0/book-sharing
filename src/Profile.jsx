import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";
//import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Firestoreからユーザー情報を取得
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (!user) {
    return <p>ログインしていません。</p>;
  }

  return (
    <div className="profile-container">
      <h1>プロフィール</h1>

      {/*ホーム画面へ戻るボタン */}
      <Link to="/">
        <button className="home-button">戻る</button>
      </Link>

      {userData && (
        <div className="profile-info">
          <p>
            <strong>名前:</strong> {userData.username}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>プロフィール文:</strong> {userData.text}
          </p>
          <p>
            <strong>フォロー中のユーザー:</strong>{" "}
            {userData.following_userid.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
