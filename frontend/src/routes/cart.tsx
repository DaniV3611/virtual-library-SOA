import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import toast from "react-hot-toast";
import { API_ENDPOINT } from "../config";

export const Route = createFileRoute("/cart")({
  component: Cart,
});

function Cart() {
  const { isAuthenticated, authToken } = useAuth();
  const { cartItems, removeFromCart, reloadCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate derived values
  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.book.price,
    0
  );

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      toast.error("Please log in to view your cart");
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, don't render the cart content
  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleRemoveFromCart = async (bookId: string) => {
    setIsLoading(true);
    const success = await removeFromCart(bookId);
    setIsLoading(false);

    if (success) {
      toast.success("Item removed from cart");
    } else {
      toast.error("Failed to remove item from cart");
    }
  };

  const handleBuyNow = async () => {
    setIsLoading(true);
    // Here you would call your API to process the purchase

    try {
      const res = await fetch(`${API_ENDPOINT}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const order = await res.json();

      setIsLoading(false);

      toast.success("Order created!");

      setTimeout(() => {
        navigate({ to: `/orders/${order.id}` });
      }, 1500);
    } catch (error) {
      console.error("Error processing purchase:", error);
      toast.error("Failed to process purchase");
      setIsLoading(false);
    }

    await reloadCart();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {isLoading && !cartItems.length ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: Cart items */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow divide-y divide-gray-300">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row p-4 gap-4"
                >
                  {/* Book cover */}
                  <div className="w-full sm:w-24 h-32 bg-gray-200 flex-shrink-0">
                    {item.book.cover_url ? (
                      <img
                        src={item.book.cover_url}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Cover</span>
                      </div>
                    )}
                  </div>

                  {/* Book details */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{item.book.title}</h3>
                    <p className="text-sm text-gray-600">
                      by {item.book.author}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ${item.book.price.toFixed(2)}
                    </p>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleRemoveFromCart(item.id.toString())}
                        className="text-red-600 hover:text-red-800 hover:bg-red-300 text-sm px-3 py-1 rounded bg-red-200 cursor-pointer duration-300"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Order summary */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items):</span>
                  <span className="font-semibold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-3 mt-3"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition duration-300 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Purchase Now"}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By purchasing, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any books to your cart yet.
          </p>
          <Link to="/books">
            <button className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-semibold transition duration-300 cursor-pointer">
              Explore Books
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
