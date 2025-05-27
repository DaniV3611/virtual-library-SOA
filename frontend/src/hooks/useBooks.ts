import { useState, useEffect } from "react";
import { apiClient } from "@/utils/apiClient";
import { Book } from "@/types/books";

export function useBooks() {
  const [mostPurchased, setMostPurchased] = useState<Book[]>([]);
  const [latest, setLatest] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch most purchased books
        const mostPurchasedResponse = await apiClient.get(
          "/books/most-purchased"
        );
        if (!mostPurchasedResponse.ok)
          throw new Error("Failed to fetch most purchased books");
        const mostPurchasedData = await mostPurchasedResponse.json();
        setMostPurchased(mostPurchasedData);

        // Fetch latest books
        const latestResponse = await apiClient.get("/books/latest");
        if (!latestResponse.ok) throw new Error("Failed to fetch latest books");
        const latestData = await latestResponse.json();
        setLatest(latestData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { mostPurchased, latest, isLoading, error };
}
