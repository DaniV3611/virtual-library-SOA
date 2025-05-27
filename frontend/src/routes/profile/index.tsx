import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { apiClient } from "@/utils/apiClient";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [purchasedBooks, setPurchasedBooks] = useState<PurchasedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your profile");
      navigate({ to: "/login" });
      return;
    }

    const fetchPurchasedBooks = async () => {
      try {
        const response = await apiClient.get("/books/purchased");

        if (!response.ok) {
          throw new Error("Failed to fetch purchased books");
        }

        const data = await response.json();
        setPurchasedBooks(data);
      } catch (error) {
        console.error("Error fetching purchased books:", error);
        toast.error("Failed to load your purchased books");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedBooks();
  }, [isAuthenticated, authToken, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold drop-shadow-md">Purchased Books</h1>
      {isLoading ? (
        <div className="flex justify-center my-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : purchasedBooks.length === 0 ? (
        <>
          <p>You haven't purchased any books yet.</p>
          <Button onClick={() => navigate({ to: "/books" })}>
            Browse Books
          </Button>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No Cover</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <div className="flex justify-between items-center mb-8">
  //       <h1 className="text-3xl font-bold">My Profile</h1>
  //       <a
  //         href="/orders"
  //         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition duration-300"
  //       >
  //         View My Orders
  //       </a>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {purchasedBooks.length === 0 ? (
  //         <div className="col-span-full text-center py-12">
  //           <p className="text-gray-600 text-lg">
  //             You haven't purchased any books yet.
  //           </p>
  //           <a
  //             href="/books"
  //             className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition duration-300"
  //           >
  //             Browse Books
  //           </a>
  //         </div>
  //       ) : (
  //         purchasedBooks.map((book) => (
  //           <div
  //             key={book.id}
  //             className="bg-white rounded-lg shadow overflow-hidden"
  //           >
  //             <div className="h-48 bg-gray-200">
  //               {book.cover_url ? (
  //                 <img
  //                   src={book.cover_url}
  //                   alt={book.title}
  //                   className="w-full h-full object-cover"
  //                 />
  //               ) : (
  //                 <div className="w-full h-full flex items-center justify-center">
  //                   <span className="text-gray-400">No Cover</span>
  //                 </div>
  //               )}
  //             </div>
  //             <div className="p-4">
  //               <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
  //               <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
  //               {book.file_url && (
  //                 <a
  //                   href={book.file_url}
  //                   download
  //                   className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition duration-300 text-center block"
  //                 >
  //                   Download Book
  //                 </a>
  //               )}
  //             </div>
  //           </div>
  //         ))
  //       )}
  //     </div>
  //   </div>
  // );
}
