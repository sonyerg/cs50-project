import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFavorites, getUser } from "@/services/api";
import type { Book } from "../services/api";

const ProfilePage: React.FC = () => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        const favs = await getFavorites();

        setUsername(user.username);
        setFavorites(favs);
      } catch (error) {
        console.error("Error loading profile:", error);
        navigate("/login"); // redirect if not logged in
      }
    };

    fetchData();
  }, [navigate]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleViewDetailsClick = (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBackClick} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="mb-6 font-serif">
          <CardContent className="flex items-center space-x-6 py-6">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-3xl font-semibold">
              {username[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {username}
              </h1>
              <p className="text-gray-600">Your profile and favorites</p>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Books Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Favorite Books</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-serif">
            {favorites.length === 0 ? (
              <p className="text-gray-600 col-span-full">No favorites yet.</p>
            ) : (
              favorites.map((book) => (
                <Card
                  key={book.id}
                  className="h-full flex flex-col overflow-hidden"
                >
                  <CardContent className="p-0 flex-1">
                    <img
                      src={book.image_url || "/placeholder-book.jpg"}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 space-y-1">
                      <h2 className="text-lg font-semibold">{book.title}</h2>
                      <p className="text-gray-600 text-sm">by {book.author}</p>
                      <p className="text-gray-500 text-sm">
                        Genre: {book.genre}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => handleViewDetailsClick(e, book.id)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
