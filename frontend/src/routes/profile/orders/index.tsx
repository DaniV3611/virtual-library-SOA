import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaShoppingBag,
  FaEye,
  FaSyncAlt,
  FaExclamationTriangle,
  FaReceipt,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

export const Route = createFileRoute("/profile/orders/")({
  component: RouteComponent,
});

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

function RouteComponent() {
  const navigate = useNavigate();
  const { authToken, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "shipped":
      case "in_transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return <FaCheckCircle className="w-3 h-3" />;
      case "pending":
      case "processing":
        return <FaClock className="w-3 h-3" />;
      case "shipped":
      case "in_transit":
        return <FaTruck className="w-3 h-3" />;
      case "cancelled":
      case "failed":
        return <FaTimesCircle className="w-3 h-3" />;
      default:
        return <FaClock className="w-3 h-3" />;
    }
  };

  const getOrderStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load orders";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your orders");
      navigate({ to: "/login" });
      return;
    }

    fetchOrders();
  }, [authToken, navigate, isAuthenticated]);

  const handleRefreshOrders = () => {
    fetchOrders();
    toast.success("Orders refreshed");
  };

  const handleViewOrder = (orderId: string) => {
    navigate({ to: `/profile/orders/${orderId}` });
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FaShoppingBag className="w-5 h-5" />
                Order History
              </CardTitle>
              <CardDescription>
                View all your orders and track their status
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshOrders}
              disabled={loading}
            >
              <FaSyncAlt
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaSyncAlt className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaExclamationTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-destructive mb-2">Error loading orders</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleRefreshOrders} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaReceipt className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No orders found</p>
                <p className="text-sm text-muted-foreground">
                  When you make purchases, your order history will appear here
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {orders.length} orders
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium font-mono">
                            #{order.id.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {formatDate(order.created_at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getOrderStatusColor(
                            order.status
                          )} border flex items-center gap-1 w-fit`}
                        >
                          {getOrderStatusIcon(order.status)}
                          {getOrderStatusText(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <FaEye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
