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
import { Separator } from "@/components/ui/separator";

import {
  FaArrowLeft,
  FaCreditCard,
  FaReceipt,
  FaCalendar,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPrint,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Payment } from "@/types/payment";

export const Route = createFileRoute("/profile/payments/$id")({
  component: PaymentInvoice,
});

function PaymentInvoice() {
  const { id } = Route.useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    getPaymentById,
    getPaymentStatusColor,
    getPaymentStatusText,
    formatCurrency,
    formatDate,
    getCardIcon,
  } = usePayments();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view payment details");
      navigate({ to: "/login" });
      return;
    }

    const fetchPayment = async () => {
      setLoading(true);
      const paymentData = await getPaymentById(id);
      setPayment(paymentData);
      setLoading(false);

      if (!paymentData) {
        toast.error("Payment not found");
        navigate({ to: "/profile/payments" });
      }
    };

    fetchPayment();
  }, [id, isAuthenticated, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-600" />;
      case "failed":
      case "rejected":
        return <FaTimesCircle className="text-red-600" />;
      case "pending":
        return <FaClock className="text-yellow-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <FaReceipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Payment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 print:p-4">
      {/* Header with back button and print (only show on screen) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/profile/payments" })}
          className="flex items-center gap-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Payments
        </Button>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <FaPrint className="w-4 h-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Content */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <FaReceipt className="w-6 h-6" />
            Payment Invoice
          </CardTitle>
          <CardDescription>
            Invoice #{payment.id.slice(-12).toUpperCase()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Status Section */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getStatusIcon(payment.status)}
              <Badge
                className={`${getPaymentStatusColor(payment.status)} border text-lg px-4 py-2`}
              >
                {getPaymentStatusText(payment.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Payment processed on {formatDate(payment.created_at)}
            </p>
          </div>

          <Separator />

          {/* Payment Amount */}
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(payment.amount)}
            </p>
            <p className="text-muted-foreground">Total Amount</p>
          </div>

          <Separator />

          {/* Payment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FaCreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {getCardIcon(payment.card_brand)}
                  </span>
                  <div>
                    <p className="font-medium">
                      {payment.card_brand || "Credit Card"}
                    </p>
                    {payment.card_last_four && (
                      <p className="text-sm text-muted-foreground">
                        •••• •••• •••• {payment.card_last_four}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Method:
                    </span>
                    <span>{payment.payment_method || "Credit Card"}</span>
                  </div>

                  {payment.epayco_transaction_id && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Transaction ID:
                      </span>
                      <span className="font-mono text-sm">
                        {payment.epayco_transaction_id}
                      </span>
                    </div>
                  )}

                  {payment.epayco_approval_code && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Approval Code:
                      </span>
                      <span className="font-mono">
                        {payment.epayco_approval_code}
                      </span>
                    </div>
                  )}

                  {payment.epayco_receipt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receipt:</span>
                      <span className="font-mono">
                        {payment.epayco_receipt}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FaReceipt className="w-5 h-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">
                    #{payment.order_id.slice(-8)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total:</span>
                  <span className="font-semibold">
                    {formatCurrency(payment.order_total)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Status:</span>
                  <Badge variant="outline">{payment.order_status}</Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span>{formatDate(payment.order_created_at)}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate({ to: `/profile/orders/${payment.order_id}` })
                  }
                  className="w-full mt-2 flex items-center gap-2"
                >
                  <FaReceipt className="w-3 h-3" />
                  View Order Details
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          {(payment.client_name ||
            payment.client_email ||
            payment.client_phone) && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FaUser className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payment.client_name && (
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-muted-foreground" />
                      <span>{payment.client_name}</span>
                    </div>
                  )}

                  {payment.client_email && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-muted-foreground" />
                      <span>{payment.client_email}</span>
                    </div>
                  )}

                  {payment.client_phone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-4 h-4 text-muted-foreground" />
                      <span>{payment.client_phone}</span>
                    </div>
                  )}

                  {payment.client_ip && (
                    <div className="flex items-center gap-2">
                      <FaGlobe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">
                        {payment.client_ip}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Transaction Timeline */}
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FaCalendar className="w-5 h-5" />
                Transaction Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Payment Initiated:
                </span>
                <span>{formatDate(payment.created_at)}</span>
              </div>

              {payment.processed_at && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Payment Processed:
                  </span>
                  <span>{formatDate(payment.processed_at)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{formatDate(payment.updated_at)}</span>
              </div>

              {payment.epayco_response_message && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Response:</strong> {payment.epayco_response_message}
                  </p>
                  {payment.epayco_response_code && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Response Code: {payment.epayco_response_code}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              This is an electronic receipt. No signature required.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Generated on {formatDate(new Date().toISOString())}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
