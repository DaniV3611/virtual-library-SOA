import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export const Route = createFileRoute("/cart")({
  component: Cart,
});

function Cart() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      toast.error("Please log in to view your cart");
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, don't render the cart content
  // (this prevents a flash of content before redirect)
  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {/* Cart content will go here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p>Welcome {user?.name}! This is your cart.</p>

        {/* Placeholder for actual cart implementation */}
        <div className="my-4 p-4 bg-gray-100 rounded">
          <p className="text-gray-600">Your cart items will appear here.</p>
        </div>
      </div>
    </div>
  );
}
