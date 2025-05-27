import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useHiddenBooks } from "@/hooks/useHiddenBooks";
import { apiClient } from "@/utils/apiClient";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FaBook,
  FaDownload,
  FaCalendar,
  FaUser,
  FaBookOpen,
  FaSyncAlt,
  FaExclamationTriangle,
  FaShoppingCart,
  FaEllipsisV,
  FaEyeSlash,
  FaShare,
} from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

interface PurchasedBook {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string | null;
  file_url: string | null;
  order_id: string;
  purchased_at: string;
}

function RouteComponent() {
  const { isAuthenticated, authToken } = useAuth();
  const { hideBook } = useHiddenBooks();
  const navigate = useNavigate();
  const [purchasedBooks, setPurchasedBooks] = useState<PurchasedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchasedBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get("/books/purchased");

      if (!response.ok) {
        throw new Error("Failed to fetch purchased books");
      }

      const data = await response.json();
      setPurchasedBooks(data);
    } catch (error) {
      console.error("Error fetching purchased books:", error);
      setError("Failed to load your purchased books");
      toast.error("Failed to load your purchased books");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your profile");
      navigate({ to: "/login" });
      return;
    }

    fetchPurchasedBooks();
  }, [isAuthenticated, authToken, navigate]);

  const handleRefresh = () => {
    fetchPurchasedBooks();
    toast.success("Books refreshed");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleHideBook = async (
    bookId: string,
    bookTitle: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent card click
    const success = await hideBook(bookId);
    if (success) {
      toast.success(`"${bookTitle}" has been hidden from your library`);
      // Remove from current view
      setPurchasedBooks((prev) => prev.filter((book) => book.id !== bookId));
    }
  };

  const getShareLink = (bookId: string) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.origin + "/books");
      url.searchParams.set("book_id", bookId);
      return url.toString();
    }
    return "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FaBookOpen className="w-8 h-8 text-primary" />
            My Library
          </h1>
          <p className="text-muted-foreground">
            Your collection of purchased books
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <FaSyncAlt className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSyncAlt className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">Loading your library...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch your books
            </p>
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaExclamationTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Books
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <FaSyncAlt className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : purchasedBooks.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaBook className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Books Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                You haven't purchased any books yet. Start building your digital
                library by browsing our collection.
              </p>
              <Button
                onClick={() => navigate({ to: "/books" })}
                className="flex items-center gap-2"
              >
                <FaShoppingCart className="w-4 h-4" />
                Browse Books
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <FaBook className="w-8 h-8 text-primary mr-4" />
                <div>
                  <p className="text-2xl font-bold">{purchasedBooks.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Books Purchased
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <FaDownload className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">
                    {purchasedBooks.filter((book) => book.file_url).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available Downloads
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <FaCalendar className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">
                    {
                      new Set(
                        purchasedBooks.map((book) =>
                          new Date(book.purchased_at).getFullYear()
                        )
                      ).size
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Years Collecting
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchasedBooks.map((book) => (
              <Card
                key={book.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden pt-0"
              >
                <div className="relative">
                  {/* Dropdown menu */}
                  <div className="absolute top-2 left-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaEllipsisV className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={(e) =>
                            handleHideBook(book.id, book.title, e)
                          }
                          className="text-muted-foreground"
                        >
                          <FaEyeSlash className="mr-2 h-3 w-3" />
                          Hide from library
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(getShareLink(book.id));
                          }}
                        >
                          <FaShare className="mr-2 h-3 w-3" />
                          Share book
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="aspect-[3/4] bg-muted">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBook className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {book.file_url && (
                    <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
                      <FaDownload className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <FaUser className="w-3 h-3" />
                    {book.author}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FaCalendar className="w-3 h-3" />
                    Purchased {formatDate(book.purchased_at)}
                  </div>

                  {book.file_url && (
                    <Button asChild className="w-full" variant="default">
                      <a href={book.file_url} download>
                        <FaDownload className="w-4 h-4 mr-2" />
                        Download Book
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate({ to: `/profile/orders/${book.order_id}` })
                    }
                    className="w-full text-xs"
                  >
                    View Order Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
