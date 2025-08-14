import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { isLoggedIn } from "./services/api";
import BookDetail from "./pages/BookDetails";

import "./App.css";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    async function authStatus() {
      const data = await isLoggedIn();
      setIsAuth(data);
    }

    authStatus();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isAuth={isAuth} />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
