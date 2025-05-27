import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useHiddenBooks } from "@/hooks/useHiddenBooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaEyeSlash,
  FaEye,
  FaBook,
  FaSyncAlt,
  FaExclamationTriangle,
  FaUser,
  FaCalendar,
  FaDownload,
} from "react-icons/fa";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/hidden-books")({
  component: HiddenBooksPage,
});

function HiddenBooksPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { hiddenBooks, loading, error, fetchHiddenBooksDetails, unhideBook } =
    useHiddenBooks();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your hidden books");
      navigate({ to: "/login" });
      return;
    }

    fetchHiddenBooksDetails();
  }, [isAuthenticated, navigate, fetchHiddenBooksDetails]);

  const handleUnhideBook = async (bookId: string, bookTitle: string) => {
    const success = await unhideBook(bookId);
    if (success) {
      toast.success(`"${bookTitle}" is now visible again`);
      // Refresh the list
      fetchHiddenBooksDetails();
    }
  };

  const handleRefresh = () => {
    fetchHiddenBooksDetails();
    toast.success("Hidden books refreshed");
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FaEyeSlash className="w-8 h-8 text-muted-foreground" />
            Hidden Books
          </h1>
          <p className="text-muted-foreground">
            Manage books you've hidden from your main library view
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <FaSyncAlt className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSyncAlt className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">Loading hidden books...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch your hidden books
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
      ) : hiddenBooks.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaEye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Hidden Books</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                You haven't hidden any books yet. When you hide books from your
                library, they'll appear here for easy management.
              </p>
              <Button
                onClick={() => navigate({ to: "/books" })}
                className="flex items-center gap-2"
              >
                <FaBook className="w-4 h-4" />
                Browse Books
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <FaEyeSlash className="w-8 h-8 text-muted-foreground mr-4" />
                <div>
                  <p className="text-2xl font-bold">{hiddenBooks.length}</p>
                  <p className="text-sm text-muted-foreground">Books Hidden</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <FaBook className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(hiddenBooks.map((book) => book.author)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Different Authors
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hidden Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hiddenBooks.map((book) => (
              <Card
                key={book.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
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
                  <Badge className="absolute top-2 right-2 bg-muted-foreground hover:bg-muted-foreground/80">
                    <FaEyeSlash className="w-3 h-3 mr-1" />
                    Hidden
                  </Badge>
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
                    Purchased:{" "}
                    {new Date(book.purchased_at).toLocaleDateString()}
                  </div>

                  {book.file_url && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <FaDownload className="w-3 h-3" />
                      Download available
                    </div>
                  )}

                  <Button
                    onClick={() => handleUnhideBook(book.id, book.title)}
                    className="w-full"
                    variant="outline"
                  >
                    <FaEye className="w-4 h-4 mr-2" />
                    Unhide Book
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
