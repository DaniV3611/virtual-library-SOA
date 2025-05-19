import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { API_ENDPOINT } from "../../config";
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

export const Route = createFileRoute("/books/")({
  component: BooksPage,
});

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectOpen, setSelectOpen] = useState(false);

  const { cartItems, addToCart } = useCart();

  const navigate = useNavigate();

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
            // <Card key={book.id} className="w-full">
            //   <CardHeader className="text-center">
            //     <CardTitle className="text-center">{book.title}</CardTitle>
            //     <CardDescription className="text-center p-2 line-clamp-2">
            //       {book.description}
            //     </CardDescription>
            //   </CardHeader>
            //   <CardContent className="flex items-center justify-center">
            //     <img
            //       src={book.cover_url ?? ""}
            //       alt={book.title}
            //       className="h-64 aspect-[2/3] object-cover rounded-md"
            //     />
            //   </CardContent>
            // </Card>
            <Card
              key={book.id}
              className="w-full pt-0 flex flex-col justify-between shadow-lg"
            >
              <img
                src={book.cover_url ?? ""}
                alt={book.title}
                className="h-64 aspect-[2/3] object-cover rounded-md rounded-b-none"
              />
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
                    <Button size="sm" onClick={() => addBookToCart(book.id)}>
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        //   {filteredBooks.map((book) => (
        //     <div
        //       key={book.id}
        //       className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
        //     >
        //       <div className="h-64 bg-gray-200 overflow-hidden">
        //         {book.cover_url ? (
        //           <img
        //             src={book.cover_url}
        //             alt={book.title}
        //             className="w-full h-full object-cover"
        //           />
        //         ) : (
        //           <div className="w-full h-full flex items-center justify-center bg-gray-200">
        //             <span className="text-gray-400">No Cover</span>
        //           </div>
        //         )}
        //       </div>

        //       <div className="p-4">
        //         <h3 className="text-lg font-semibold mb-1 truncate">
        //           {book.title}
        //         </h3>
        //         <p className="text-gray-600 text-sm mb-2">by {book.author}</p>

        //         {book.category_id && (
        //           <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
        //             {getCategoryNameById(book.category_id)}
        //           </span>
        //         )}

        //         <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        //           {book.description || "No description available"}
        //         </p>

        //         <div className="flex justify-between items-center">
        //           <span className="text-lg font-bold">
        //             ${book.price.toFixed(2)}
        //           </span>
        //           {cartItems.some((item) => item.book.id === book.id) ? (
        //             <p className="text-green-600 px-3 py-1 bg-green-200 rounded text-sm">
        //               Added
        //             </p>
        //           ) : (
        //             <button
        //               className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-3 py-1 rounded text-sm"
        //               onClick={async () => addBookToCart(book.id)}
        //             >
        //               Add to Cart
        //             </button>
        //           )}
        //         </div>
        //       </div>
        //     </div>
        //   ))}
        // </div>

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
    </div>
  );
}
