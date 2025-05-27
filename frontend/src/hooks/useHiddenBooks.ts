import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/utils/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  HiddenBooksResponse,
  ToggleBookVisibilityRequest,
} from "@/types/userHiddenBooks";

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

export function useHiddenBooks() {
  const { isAuthenticated } = useAuth();
  const [hiddenBookIds, setHiddenBookIds] = useState<string[]>([]);
  const [hiddenBooks, setHiddenBooks] = useState<PurchasedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch hidden book IDs
  const fetchHiddenBooks = useCallback(async () => {
    if (!isAuthenticated) {
      setHiddenBookIds([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/user-books/hidden-books");
      if (!response.ok) {
        throw new Error("Failed to fetch hidden books");
      }

      const data: HiddenBooksResponse = await response.json();
      setHiddenBookIds(data.hidden_books);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching hidden books:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch detailed hidden books
  const fetchHiddenBooksDetails = useCallback(async () => {
    if (!isAuthenticated) {
      setHiddenBooks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/user-books/hidden-books/details");
      if (!response.ok) {
        throw new Error("Failed to fetch hidden books details");
      }

      const data: PurchasedBook[] = await response.json();
      setHiddenBooks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching hidden books details:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Toggle book visibility
  const toggleBookVisibility = useCallback(
    async (bookId: string, hide: boolean): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error("You must be logged in to hide books");
        return false;
      }

      try {
        const requestData: ToggleBookVisibilityRequest = {
          book_id: bookId,
          hide,
        };

        const response = await apiClient.post(
          "/user-books/toggle-visibility",
          requestData
        );

        if (!response.ok) {
          throw new Error("Failed to toggle book visibility");
        }

        await response.json();

        // Update local state
        if (hide) {
          setHiddenBookIds((prev) => [...prev, bookId]);
          toast.success("Book hidden successfully");
        } else {
          setHiddenBookIds((prev) => prev.filter((id) => id !== bookId));
          setHiddenBooks((prev) => prev.filter((book) => book.id !== bookId));
          toast.success("Book unhidden successfully");
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        toast.error(
          `Failed to ${hide ? "hide" : "unhide"} book: ${errorMessage}`
        );
        console.error("Error toggling book visibility:", err);
        return false;
      }
    },
    [isAuthenticated]
  );

  // Hide a book
  const hideBook = useCallback(
    (bookId: string) => toggleBookVisibility(bookId, true),
    [toggleBookVisibility]
  );

  // Unhide a book
  const unhideBook = useCallback(
    (bookId: string) => toggleBookVisibility(bookId, false),
    [toggleBookVisibility]
  );

  // Check if a book is hidden
  const isBookHidden = useCallback(
    (bookId: string): boolean => {
      return hiddenBookIds.includes(bookId);
    },
    [hiddenBookIds]
  );

  // Initialize on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchHiddenBooks();
    } else {
      // Clear state when user logs out
      setHiddenBookIds([]);
      setHiddenBooks([]);
      setError(null);
    }
  }, [isAuthenticated, fetchHiddenBooks]);

  return {
    hiddenBookIds,
    hiddenBooks,
    loading,
    error,
    fetchHiddenBooks,
    fetchHiddenBooksDetails,
    toggleBookVisibility,
    hideBook,
    unhideBook,
    isBookHidden,
  };
}
