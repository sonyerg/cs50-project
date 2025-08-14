import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, LogOut, LogIn } from "lucide-react";

import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
import { logout } from "@/services/api";
import toast from "react-hot-toast";

interface LibraryHeaderProps {
  isAuth: boolean;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ isAuth }) => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.success("Logout successful");
      window.location.assign("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  const handleLoginClick = () => {
    if (!isAuth) navigate("/login");
    return;
  };

  const handleProfileClick = () => {
    if (!isAuth) navigate("/login");

    navigate("/profile");
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              <BookOpen className="h-8 w-8 text-green-700" />
              <h1 className="text-2xl font-bold text-gray-900">
                Digital Library
              </h1>
            </div>
          </div>

          <div className="items-center text-gray-700 text-lg hidden sm:inline font-serif">
            <i>Top 100 Greatest Books of All Time</i>
          </div>

          <div className="flex items-center space-x-3 font-sans">
            {isAuth ? (
              <Button variant="outline" size="sm" onClick={handleLogoutClick}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLoginClick}>
                <LogIn className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}

            {isAuth && (
              <Button variant="outline" size="sm" onClick={handleProfileClick}>
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryHeader;
