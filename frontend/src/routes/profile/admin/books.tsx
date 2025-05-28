import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../utils/apiClient";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "../../../lib/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string | null;
  file_url: string | null;
  category: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export const Route = createFileRoute("/profile/admin/books")({
  component: AdminBooksPage,
});

function AdminBooksPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  // Popover states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [sortOrderOpen, setSortOrderOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate({ to: "/" });
      return;
    }

    fetchData();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch all books
      const booksResponse = await apiClient.get("/books");
      if (!booksResponse.ok) throw new Error("Failed to fetch books");
      const booksData = await booksResponse.json();
      setBooks(booksData);

      // Fetch categories
      const categoriesResponse = await apiClient.get("/categories");
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load books data");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...books];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (book) => book.category_id === selectedCategory
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "author":
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "category":
          aValue = getCategoryNameById(a.category_id)?.toLowerCase() || "";
          bValue = getCategoryNameById(b.category_id)?.toLowerCase() || "";
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const getCategoryNameById = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "No category";
  };

  const getCategoryDisplayName = (categoryId: string): string => {
    if (categoryId === "all") return "All Categories";
    return getCategoryNameById(categoryId);
  };

  const getSortByDisplayName = (sortBy: string): string => {
    switch (sortBy) {
      case "title":
        return "Title";
      case "author":
        return "Author";
      case "price":
        return "Price";
      case "category":
        return "Category";
      default:
        return "Title";
    }
  };

  const getSortOrderDisplayName = (sortOrder: string): string => {
    return sortOrder === "asc" ? "Ascending" : "Descending";
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    setSelectedBookId(bookId);
    setSelectedBookTitle(bookTitle);
    setIsConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedBookId) return;

    try {
      const response = await apiClient.delete(`/books/${selectedBookId}`);
      if (!response.ok) throw new Error("Failed to delete book");

      toast.success("Book deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    } finally {
      setSelectedBookId(null);
      setSelectedBookTitle("");
      setIsConfirmingDelete(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("title");
    setSortOrder("asc");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/profile/admin" })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">All Books</h1>
            <p className="text-muted-foreground">
              Manage all books in your library
            </p>
          </div>
        </div>
        <Link to="/profile/admin/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter and search through your book collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between"
                  >
                    {getCategoryDisplayName(selectedCategory)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedCategory("all");
                            setCategoryOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategory === "all"
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          All Categories
                        </CommandItem>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.id}
                            onSelect={() => {
                              setSelectedCategory(category.id);
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategory === category.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Popover open={sortByOpen} onOpenChange={setSortByOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={sortByOpen}
                    className="w-full justify-between"
                  >
                    {getSortByDisplayName(sortBy)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {[
                          { value: "title", label: "Title" },
                          { value: "author", label: "Author" },
                          { value: "price", label: "Price" },
                          { value: "category", label: "Category" },
                        ].map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              setSortBy(option.value);
                              setSortByOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                sortBy === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Popover open={sortOrderOpen} onOpenChange={setSortOrderOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={sortOrderOpen}
                    className="w-full justify-between"
                  >
                    {getSortOrderDisplayName(sortOrder)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {[
                          { value: "asc", label: "Ascending" },
                          { value: "desc", label: "Descending" },
                        ].map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              setSortOrder(option.value);
                              setSortOrderOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                sortOrder === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBooks.length} of {books.length} books
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Books Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBooks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div className="h-16 w-12 bg-gray-200 rounded overflow-hidden">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{book.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      {book.category_id ? (
                        <Badge variant="outline">
                          {getCategoryNameById(book.category_id)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          No category
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        ${book.price.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link to="/books" search={{ book_id: book.id }}>
                          <Button variant="ghost" size="sm" title="View Book">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to="/profile/admin/$id" params={{ id: book.id }}>
                          <Button variant="ghost" size="sm" title="Edit Book">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-6">
                {books.length === 0
                  ? "No books have been added to the library yet."
                  : "No books match your current filters."}
              </p>
              {books.length === 0 ? (
                <Link to="/profile/admin/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Book
                  </Button>
                </Link>
              ) : (
                <Button onClick={clearFilters}>Clear Filters</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBookTitle}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
