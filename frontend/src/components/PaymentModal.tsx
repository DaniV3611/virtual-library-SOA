import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (paymentData: any) => Promise<{
    status: string;
    id: string;
    user_id: string;
    total_amount: number;
    created_at: string;
    payment_id?: string;
    items: any[];
  }>;
  totalAmount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPay,
  totalAmount,
}: PaymentModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Credit card info
    cardNumber: "",
    expYear: "",
    expMonth: "",
    cvc: "",

    // Client info (simplified)
    phone: "",
    identification: "",
    city: "", // Optional
    address: "", // Optional
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading("Processing payment...", {
      duration: Infinity,
    });

    try {
      const response = await onPay(formData);
      toast.dismiss(loadingToast);

      // Show enhanced notifications based on payment status
      if (response.status === "completed") {
        toast.success("🎉 Payment completed successfully!", {
          duration: 4000,
        });

        // Redirect to invoice after 2 seconds if payment_id is available
        if (response.payment_id) {
          setTimeout(() => {
            navigate({ to: `/profile/payments/${response.payment_id}` });
          }, 2000);

          toast.success("Redirecting to invoice in 2 seconds...", {
            duration: 2000,
          });
        }
      } else if (response.status === "pending") {
        toast.loading("⏳ Payment is pending confirmation...", {
          duration: 5000,
        });

        // Still redirect to invoice for pending payments
        if (response.payment_id) {
          setTimeout(() => {
            navigate({ to: `/profile/payments/${response.payment_id}` });
          }, 2000);

          toast.success("Redirecting to invoice in 2 seconds...", {
            duration: 2000,
          });
        }
      } else if (response.status === "rejected") {
        toast.error(
          "❌ Payment was rejected. Please try another payment method.",
          {
            duration: 6000,
          }
        );
      } else if (response.status === "failed") {
        toast.error("❌ Payment failed. Please try again.", {
          duration: 6000,
        });
      } else {
        toast.error("❌ Payment could not be processed. Please try again.", {
          duration: 6000,
        });
      }

      // Close modal after successful payment processing
      if (response.status === "completed" || response.status === "pending") {
        onClose();
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);

      // Handle different types of errors with enhanced messages
      if (error.message.includes("Invalid credit info")) {
        toast.error("💳 Invalid card information. Please verify your data.", {
          duration: 6000,
        });
      } else if (error.message.includes("Failed to create ePayco client")) {
        toast.error("🔧 Error creating client. Please try again.", {
          duration: 6000,
        });
      } else if (error.message.includes("Payment failed")) {
        toast.error("💸 Payment could not be processed. Please try again.", {
          duration: 6000,
        });
      } else {
        toast.error("⚠️ Error processing payment. Please try again.", {
          duration: 6000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Information notice */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                <InfoIcon className="h-4 w-4" />
                Automatic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Your name and email will be automatically taken from your
                profile. You only need to complete the payment information and
                some additional details.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Credit Card Information */}
          <Card>
            <CardHeader>
              <CardTitle>Credit Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Card Number
                </label>
                <Input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Expiration Month
                  </label>
                  <Input
                    type="text"
                    name="expMonth"
                    value={formData.expMonth}
                    onChange={handleChange}
                    placeholder="MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Expiration Year
                  </label>
                  <Input
                    type="text"
                    name="expYear"
                    value={formData.expYear}
                    onChange={handleChange}
                    placeholder="YYYY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    CVC
                  </label>
                  <Input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="3001234567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Identification
                  </label>
                  <Input
                    type="text"
                    name="identification"
                    value={formData.identification}
                    onChange={handleChange}
                    placeholder="12345678"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    City{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bogotá"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Address{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Calle 123 # 45-67"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount:</p>
              <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </Button>
          </div>

          {/* Powered by ePayco banner */}
          <div className="flex items-center justify-center py-3 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Powered by
              <span className="font-semibold text-primary">ePayco</span>
              <svg
                className="h-3 w-3 text-muted-foreground"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
