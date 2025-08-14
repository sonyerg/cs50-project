import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, BookOpen, Heart } from "lucide-react";

import {
  type Book,
  deleteFavorite,
  getBook,
  getFavorites,
  isLoggedIn,
  postFavorite,
} from "@/services/api";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import toast from "react-hot-toast";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadBook() {
      if (!id) {
        setError("No book ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bookData = await getBook(id);
        setBook(bookData);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    }

    async function fetchFavs() {
      try {
        const res = await getFavorites();
        const ids = res.map((fav) => fav.id);
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Failed to load favorites", error);
      }
    }

    fetchFavs();
    loadBook();
  }, [id]);

  const isFavorited = (bookId: number): boolean => {
    return favoriteIds.includes(bookId);
  };

  const handleToggleFavorite = async () => {
    if (!book) return;

    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      toast.error("You must be logged in to add book to favorites");
      return navigate("/login");
    }

    try {
      // Remove books from favorites if button is toggled
      for (let i = 0; i < favoriteIds.length; i++) {
        if (book.id === favoriteIds[i]) {
          setLoading(true);
          await deleteFavorite(book.id);
          toast.success("Book removed from favorites.");
          setLoading(false);
          window.location.reload();
          return;
        }
      }

      const res = await postFavorite(book.id);
      if (res.message === "Book is already in favorites") {
        toast.error("Books is already in favorites");
      } else if (res.message === "Successfully added book to favorites") {
        toast.success("Book added to favorites!");
        setFavoriteIds((prev) => [...prev, book.id]);
      } else {
        toast.error(res.message || "Something unexpected happened.");
      }
    } catch (error) {
      toast.error("Failed to add book to favorites.");
      console.error("Failed to add favorite:", error);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gray-300 rounded mr-4"></div>
              <div className="w-24 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="w-full h-96 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-300 rounded"></div>
                  <div className="w-full h-4 bg-gray-300 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={handleBackClick}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
          </div>
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Book Not Found
            </h3>
            <p className="text-gray-500">
              {error || "The book you're looking for doesn't exist."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBackClick} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </div>

        {/* Book Details */}
        <Card className="overflow-hidden font-serif">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              {/* Book Cover */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] w-full max-w-sm mx-auto">
                  <img
                    src={book.image_url || "/placeholder-book.jpg"}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Book Information */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {book.title}
                  </h1>
                  <div className="flex items-center text-lg text-gray-600 mb-4">
                    <User className="w-5 h-5 mr-2" />
                    <span>by {book.author}</span>
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 group">
                  <Button
                    className="flex-1"
                    disabled={loading}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorited(book.id)
                      ? "Remove From Favorites"
                      : "Add to Favorites"}
                    <Heart
                      className={`ml-2 ${
                        isFavorited(book.id)
                          ? "text-red-500 fill-red-500 group-hover:text-blue-500 group-hover:fill-blue-500"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                </div>

                {/* Book Details Card */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Book Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Book Rank:</span>
                      <span className="font-medium">#{book.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Genre:</span>
                      <span className="font-medium">{book.genre}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDetail;
