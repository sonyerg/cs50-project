import React, { useEffect, useState } from "react";
import { isLoggedIn, register } from "@/services/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
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
    if (!username || !password || !confirmation) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      await register({ username, password, confirmation });
      toast.success("Registration successful. Please log in.");
      window.location.assign("/login");
    } catch (err) {
      console.error("Registration failed", err);
      setError("Registration failed");
    }
  };

  const handleLoginClick = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.assign("/login");
  };

  if (isAuth) window.location.assign("/");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Button
          variant="outline"
          onClick={() => {
            window.location.assign("/");
          }}
          className="mr-4 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Button>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
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
                htmlFor="password"
                className="block text-sm font-medium mb-1"
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
            <div>
              <label
                htmlFor="confirmation"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmation"
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full text-white py-2 rounded-lg">
              Register
            </Button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={handleLoginClick}
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
