import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { API_ENDPOINT } from "@/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

  const { authToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!authToken) {
      toast.error("Please log in to view your orders");
      navigate({ to: "/login" });
      return;
    }

    const fetchOrders = async () => {
      const response = await fetch(`${API_ENDPOINT}/orders`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, [authToken, navigate]);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold drop-shadow-md">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-200 hover:bg-neutral-200 dark:bg-neutral-800 font-bold drop-shadow-md">
              <TableHead className="rounded-tl-md">Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="rounded-tr-md text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total_amount}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate({ to: `/profile/orders/${order.id}` })
                    }
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
