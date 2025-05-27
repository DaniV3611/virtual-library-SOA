import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/utils/apiClient";
import { Payment, PaymentsResponse } from "@/types/payment";
import { toast } from "sonner";

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchPayments = useCallback(async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(
        `/orders/payments?skip=${skip}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data: PaymentsResponse = await response.json();
      setPayments(data.payments);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || "Error loading payments");
      toast.error("Error loading payments");
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentById = useCallback(
    async (paymentId: string): Promise<Payment | null> => {
      try {
        const response = await apiClient.get(`/orders/payments`);

        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data: PaymentsResponse = await response.json();
        return (
          data.payments.find((payment) => payment.id === paymentId) || null
        );
      } catch (err: any) {
        console.error("Error fetching payment:", err);
        toast.error("Error loading payment details");
        return null;
      }
    },
    []
  );

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "reversed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "retained":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "started":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "expired":
      case "abandoned":
      case "canceled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      case "rejected":
        return "Rejected";
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
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "💳"; // In production, use appropriate SVG icons
      case "mastercard":
        return "💳";
      case "american express":
        return "💳";
      default:
        return "💳";
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    total,
    fetchPayments,
    getPaymentById,
    getPaymentStatusColor,
    getPaymentStatusText,
    formatCurrency,
    formatDate,
    getCardIcon,
  };
};
