import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* ログインページ */}
        <Route path="/login" element={<Login />} />
        {/* ホーム画面 */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
