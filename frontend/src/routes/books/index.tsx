import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { API_ENDPOINT } from "../../config";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string;
  category_id: number;
  category: string;
}

export const Route = createFileRoute("/books/")({
  component: BooksPage,
});

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/categories`);

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        toast.error("Error loading categories");
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch books from the API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_ENDPOINT}/books`);

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data: Book[] = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Error loading books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on category and search term
  useEffect(() => {
    let result = books;

    // Apply category filter if not "all"
    if (selectedCategoryId !== "all") {
      result = result.filter((book) => book.category_id === selectedCategoryId);
    }

    // Apply search filter if there's a search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTermLower) ||
          book.author.toLowerCase().includes(searchTermLower)
      );
    }

    setFilteredBooks(result);
  }, [selectedCategoryId, searchTerm, books]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategoryId(value === "all" ? "all" : parseInt(value, 10));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getCategoryNameById = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading books</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Books Collection</h1>

      {/* Filters Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between p-4 bg-gray-50 rounded-lg">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            value={
              selectedCategoryId === "all"
                ? "all"
                : selectedCategoryId.toString()
            }
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Title or Author
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Type to search..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Results Count */}
      <p className="mb-4 text-gray-600">
        Showing {filteredBooks.length} of {books.length} books
      </p>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="h-64 bg-gray-200 overflow-hidden">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Cover</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 truncate">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">by {book.author}</p>

                {book.category_id && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                    {getCategoryNameById(book.category_id)}
                  </span>
                )}

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {book.description || "No description available"}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    ${book.price.toFixed(2)}
                  </span>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    onClick={() =>
                      toast.success(`Added ${book.title} to cart!`)
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">
            No books found matching your criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategoryId("all");
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
