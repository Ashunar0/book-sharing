import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [profileText, setProfileText] = useState("");
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setProfileText(userData.text || ""); // プロフィール文も取得
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        username: username,
        text: profileText, // プロフィール文も更新
      });
      navigate("/profile"); // プロフィールページに遷移
    }
  };

  return (
    <div className="edit-profile-container">
      <h1>プロフィール編集</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザー名:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>プロフィール文:</label>
          <textarea
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
          />
        </div>
        <button type="submit">保存</button>
      </form>
    </div>
  );
};

export default EditProfile;
