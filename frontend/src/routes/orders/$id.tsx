import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { API_ENDPOINT } from "../../config";
import PaymentModal from "../../components/PaymentModal";

interface OrderItem {
  book_id: string;
  book_title: string;
  book_author: string;
  book_description: string;
  book_image: string | null;
  book_file: string | null;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetails,
});

function OrderDetails() {
  const { id } = Route.useParams();
  const { isAuthenticated, authToken } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "reversed":
        return "bg-purple-100 text-purple-800";
      case "retained":
        return "bg-orange-100 text-orange-800";
      case "started":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "abandoned":
        return "bg-gray-100 text-gray-800";
      case "canceled":
        return "bg-gray-100 text-gray-800";
      case "created":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your order details");
      navigate({ to: "/login" });
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar la orden");
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error al cargar la orden:", error);
        toast.error("No se pudo cargar los detalles de la orden");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, authToken, navigate]);

  const handlePay = async (paymentData: any) => {
    setIsPaying(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/orders/${id}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Credit card info
          "card[number]": paymentData.cardNumber,
          "card[exp_year]": paymentData.expYear,
          "card[exp_month]": paymentData.expMonth,
          "card[cvc]": paymentData.cvc,
          hasCvv: true,

          // Client info
          name: paymentData.name,
          last_name: paymentData.lastName,
          email: paymentData.email,
          phone: paymentData.phone,
          city: paymentData.city,
          address: paymentData.address,
          cell_phone: paymentData.cellPhone,
          identification: paymentData.identification,
          amount: order?.total_amount.toString(),
          dues: "1",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process payment");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setIsPaymentModalOpen(false);
      return updatedOrder;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    } finally {
      setIsPaying(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Order not found</h2>
          <p className="text-gray-600">
            We couldn't find the details for this order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow divide-y divide-gray-300">
            <h2 className="text-xl font-semibold p-4 border-b border-gray-300">
              Order Items
            </h2>
            {order.items.map((item) => (
              <div
                key={item.book_id}
                className="flex flex-col sm:flex-row p-4 gap-4"
              >
                <div className="w-full sm:w-24 h-32 bg-gray-200 flex-shrink-0">
                  {item.book_image ? (
                    <img
                      src={item.book_image}
                      alt={item.book_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No Cover</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.book_title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {item.book_author}
                      </p>
                      <p className="text-gray-600 mt-2">
                        Quantity: {item.quantity} x ${item.price}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {order.status === "completed" && item.book_file && (
                      <a
                        href={item.book_file}
                        download
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200 h-10 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Order Details */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">{order.id}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold capitalize">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {(() => {
                        switch (order.status) {
                          case "pending":
                            return "Pending";
                          case "rejected":
                            return "Rejected";
                          case "failed":
                            return "Failed";
                          case "reversed":
                            return "Reversed";
                          case "retained":
                            return "Retained";
                          case "started":
                            return "Started";
                          case "expired":
                            return "Expired";
                          case "abandoned":
                            return "Abandoned";
                          case "canceled":
                            return "Canceled";
                          case "created":
                            return "Created";
                          case "completed":
                            return "Completed";
                          default:
                            return order.status;
                        }
                      })()}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created At:</span>
                  <span className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-xl">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {order.status !== "completed" && (
                <div className="border-t pt-4 mt-4">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={isPaying}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPaying ? "Processing payment..." : "Pay Now"}
                  </button>
                  {order.status !== "created" && (
                    <p className="mt-2 text-sm text-gray-600">
                      Current status:{" "}
                      <span className="font-semibold">
                        {(() => {
                          switch (order.status) {
                            case "pending":
                              return "Pending";
                            case "rejected":
                              return "Rejected";
                            case "failed":
                              return "Failed";
                            case "reversed":
                              return "Reversed";
                            case "retained":
                              return "Retained";
                            case "started":
                              return "Started";
                            case "expired":
                              return "Expired";
                            case "abandoned":
                              return "Abandoned";
                            case "canceled":
                              return "Canceled";
                            default:
                              return order.status;
                          }
                        })()}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {order.status === "completed" && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Your order has been completed. You can now download your
                    books using the download buttons next to each item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPay={handlePay}
        totalAmount={order?.total_amount || 0}
      />
    </div>
  );
}
