import { useState, useEffect } from "react";
import { API_ENDPOINT } from "../config";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string | null;
  file_url: string | null;
}

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
        const mostPurchasedResponse = await fetch(
          `${API_ENDPOINT}/books/most-purchased`
        );
        if (!mostPurchasedResponse.ok)
          throw new Error("Failed to fetch most purchased books");
        const mostPurchasedData = await mostPurchasedResponse.json();
        setMostPurchased(mostPurchasedData);

        // Fetch latest books
        const latestResponse = await fetch(`${API_ENDPOINT}/books/latest`);
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
