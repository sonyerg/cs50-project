import { useState, useEffect } from "react";
import { ArrowUp, Search } from "lucide-react";

import { getBooks, type Book } from "../services/api";
import BookCard from "./BookCard";
import GridSkeleton from "./GridSkeleton";
import { Input } from "@/components/ui/input";

const LibraryGrid: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const limit: number = 20;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      async function fetchBooks() {
        setLoading(true);
        try {
          const data = await getBooks(page, limit, query);

          if (page === 1) {
            // reset when new search
            setBooks(data);
          } else {
            setBooks((prev) => [...prev, ...data]);
          }

          // If less than limit, no more data
          setHasMore(data.length === limit);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }

      fetchBooks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, query]);

  return (
    <>
      {/* Search Bar */}
      <div className="pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search books, authors, genre..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1); // reset to first page on new search
            }}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {books.length === 0 && !loading ? (
        <div className="text-center py-12">No books found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="font-sans font-semibold px-4 py-2 outline-1 outline-gray-300 bg-white rounded cursor-pointer hover:bg-gray-300 transition"
              >
                Load More
              </button>
            </div>
          )}

          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 p-3 rounded-full bg-black text-white shadow-lg hover:bg-green-600 transition"
            >
              <ArrowUp size={20} />
            </button>
          )}

          {loading && <GridSkeleton />}
        </>
      )}
    </>
  );
};

export default LibraryGrid;
