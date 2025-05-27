import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { apiClient } from "@/utils/apiClient";
import { Book } from "../../types/books";
import { Category } from "../../types/categories";
import useCart from "../../hooks/useCart";
import { CommandItem } from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { CommandEmpty } from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { z } from "zod";

export const Route = createFileRoute("/books/")({
  component: BooksPage,
  validateSearch: z.object({
    book_id: z.string().optional(),
  }),
});

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [selectOpen, setSelectOpen] = useState(false);

  const { cartItems, addToCart } = useCart();

  const search = useSearch({ from: "/books/" });

  const navigate = useNavigate();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories");

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
        const response = await apiClient.get("/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data: Book[] = await response.json();
        setBooks(data);
        setFilteredBooks(data);

        if (search.book_id) {
          setSelectedBook(
            data.find((book) => book.id === search.book_id) ?? null
          );
        }
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
    if (selectedCategoryId) {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getCategoryNameById = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const addBookToCart = async (bookId: string) => {
    const res = await addToCart(bookId);
    if (res) {
      toast("Book added to cart!", {
        action: {
          label: "See cart",
          onClick: () => navigate({ to: "/cart" }),
        },
      });
    } else {
      toast.error(`You must log in`, {
        action: {
          label: "Log In",
          onClick: () => navigate({ to: "/login" }),
        },
      });
    }
  };

  const getShareLink = (bookId: string) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("book_id", bookId);
      return url.toString();
    }
    return "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Enlace copiado!");
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="animate-spin mt-20 rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="bg-red-100 mt-20 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading books</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-8 text-center drop-shadow-lg">
        Books Collection
      </h1>

      <div className="w-full flex flex-row items-center justify-between max-w-5xl px-4 gap-4">
        <Popover open={selectOpen} onOpenChange={setSelectOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={selectOpen}
              className="w-[200px] justify-between"
            >
              {selectedCategoryId
                ? categories.find(
                    (category) => category.id === selectedCategoryId
                  )?.name
                : "Select category..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search categories..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No categories found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      onSelect={(currentValue) => {
                        setSelectedCategoryId(
                          currentValue === selectedCategoryId
                            ? ""
                            : currentValue
                        );
                        setSelectOpen(false);
                      }}
                    >
                      {category.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedCategoryId === category.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-8">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="w-full pt-0 flex flex-col justify-between shadow-lg group cursor-pointer relative"
              onClick={() => setSelectedBook(book)}
            >
              <div className="h-64 aspect-[2/3] rounded-t-md overflow-hidden">
                <img
                  src={book.cover_url ?? ""}
                  alt={book.title}
                  className="h-full w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <CardHeader className="-mt-4">
                <CardTitle className="text-lg font-bold">
                  {book.title}
                </CardTitle>
                <CardDescription className="flex flex-row items-center justify-between">
                  <span className="flex items-center gap-1">
                    by {book.author}
                  </span>
                  {book.category_id && (
                    <Badge variant="outline">
                      {getCategoryNameById(book.category_id)}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="-mt-4">
                <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                  {book.description}
                </p>
                <div className="flex flex-row items-center justify-between mt-2">
                  <span className="font-bold">$ {book.price}</span>
                  {cartItems.some((item) => item.book.id === book.id) ? (
                    <Button size="sm" disabled>
                      Added to Cart
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addBookToCart(book.id);
                      }}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center pt-10 flex flex-col gap-4">
          <p className="text-lg text-gray-500">
            No books found matching your criteria
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategoryId("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
      {/* Results Count */}
      <p className="my-4 text-gray-700 dark:text-gray-300 text-sm">
        Showing {filteredBooks.length} of {books.length} books
      </p>
      {selectedBook && (
        <Dialog
          open={!!selectedBook}
          onOpenChange={() => setSelectedBook(null)}
        >
          <DialogContent className="z-[60] max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sticky top-0 z-10">
                <span className="flex items-center justify-between mr-4">
                  <span className="drop-shadow-lg">{selectedBook.title}</span>
                  {selectedBook.category_id && (
                    <Badge>
                      {getCategoryNameById(selectedBook.category_id)}
                    </Badge>
                  )}
                </span>
              </DialogTitle>
              <DialogDescription>{selectedBook.description}</DialogDescription>
              <div className="flex flex-col items-center justify-between gap-4">
                <div className="flex-1 flex flex-col gap-2 items-center justify-end">
                  <img
                    src={selectedBook.cover_url ?? ""}
                    alt={selectedBook.title}
                    className="h-64 lg:h-96 xl:h-128 rounded-md aspect-[2/3] object-cover w-full shadow-lg"
                  />
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="sticky bottom-0 z-10">
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(getShareLink(selectedBook.id))
                    }
                  >
                    Share
                  </Button>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <span className="font-bold">$ {selectedBook.price}</span>
                  {cartItems.some(
                    (item) => item.book.id === selectedBook.id
                  ) ? (
                    <Button size="sm" disabled>
                      Added to Cart
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => addBookToCart(selectedBook.id)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
