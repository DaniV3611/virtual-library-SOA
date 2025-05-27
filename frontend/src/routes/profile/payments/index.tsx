import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { usePayments } from "@/hooks/usePayments";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FaCreditCard,
  FaEye,
  FaReceipt,
  FaSyncAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    payments,
    loading,
    error,
    total,
    fetchPayments,
    getPaymentStatusColor,
    getPaymentStatusText,
    formatCurrency,
    formatDate,
    getCardIcon,
  } = usePayments();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your payments");
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleRefreshPayments = () => {
    fetchPayments();
    toast.success("Payments refreshed");
  };

  const handleViewPayment = (paymentId: string) => {
    navigate({ to: `/profile/payments/${paymentId}` });
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
                <FaCreditCard className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>
                View all your payment transactions and their details
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshPayments}
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
                <p className="text-muted-foreground">Loading payments...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaExclamationTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-destructive mb-2">Error loading payments</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleRefreshPayments} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaReceipt className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No payments found</p>
                <p className="text-sm text-muted-foreground">
                  When you make purchases, your payment history will appear here
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {payments.length} of {total} payments
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatDate(payment.created_at)}
                          </p>
                          {payment.processed_at && (
                            <p className="text-xs text-muted-foreground">
                              Processed: {formatDate(payment.processed_at)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getCardIcon(payment.card_brand)}
                          </span>
                          <div>
                            <p className="font-medium">
                              {payment.card_brand || "Credit Card"}
                            </p>
                            {payment.card_last_four && (
                              <p className="text-xs text-muted-foreground">
                                •••• {payment.card_last_four}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">
                          {formatCurrency(payment.amount)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getPaymentStatusColor(
                            payment.status
                          )} border`}
                        >
                          {getPaymentStatusText(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            Order #{payment.order_id.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(payment.order_created_at)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPayment(payment.id)}
                          >
                            <FaEye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate({
                                to: `/profile/orders/${payment.order_id}`,
                              })
                            }
                          >
                            <FaReceipt className="w-3 h-3 mr-1" />
                            Order
                          </Button>
                        </div>
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
