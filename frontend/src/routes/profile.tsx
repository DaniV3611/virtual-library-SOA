import {
  createFileRoute,
  Outlet,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { FaBookOpen, FaList } from "react-icons/fa";
import { Card } from "@/components/ui/card";
export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { isAuthenticated, authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your profile");
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, authToken, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full h-dvh flex flex-row items-center pt-13">
      <aside className="w-xs h-full p-4 flex flex-col gap-2">
        <Button
          variant={location.pathname === "/profile" ? "secondary" : "ghost"}
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate({ to: "/profile" })}
        >
          <FaBookOpen />
          Books
        </Button>
        <Button
          variant={
            location.pathname === "/profile/orders" ? "secondary" : "ghost"
          }
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate({ to: "/profile/orders" })}
        >
          <FaList />
          Orders
        </Button>
        <Button
          variant={location.pathname === "/profile/me" ? "secondary" : "ghost"}
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate({ to: "/profile/me" })}
        >
          <FaUser />
          Profile
        </Button>
      </aside>
      <aside className="w-full h-full p-4 pl-0">
        <Card className="w-full h-full rounded-md overflow-y-auto p-0">
          <Outlet />
        </Card>
      </aside>
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
