import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ImageOff, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import type { Book } from "@/services/api";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [imgError, setImgError] = useState(false);

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    navigate(`/book/${book.id}`);
  };

  return (
    <Card
      className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {book.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <User className="w-4 h-4" />
              {book.author}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex items-center justify-center pb-3 h-40">
          {!book.image_url || imgError ? (
            <div className="flex flex-col items-center justify-center text-gray-700 space-y-2">
              <ImageOff size={42} />
              <p className="font-medium">Image not available</p>
            </div>
          ) : (
            <img
              src={book.image_url}
              alt={book.title}
              onError={() => setImgError(true)}
              className="max-h-full object-contain"
            />
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
      </CardContent>

      <CardFooter>
        <Button size="sm" className="w-full" onClick={handleViewDetailsClick}>
          <BookOpen className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
