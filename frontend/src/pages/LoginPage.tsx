import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { isLoggedIn, login } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    async function authStatus() {
      try {
        const data = await isLoggedIn();
        setIsAuth(data);
      } catch (error) {
        console.error(error);
      }
    }

    authStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      await login({ username, password });
      console.log("Login successful");
      window.location.assign("/");
    } catch (err) {
      console.error("Error logging in", err);
      setError("Login failed");
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  // navigate user away if already logged in
  if (isAuth) window.location.assign("/");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Button variant="outline" onClick={() => {window.location.assign("/")}} className="mr-4 mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Button>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full text-white py-2 rounded-lg">
              Login
            </Button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={handleSignup}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
