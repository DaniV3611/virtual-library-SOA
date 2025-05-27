import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

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

    // Client info
    name: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    cellPhone: "",
    identification: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to allow the backdrop to fade in before the modal appears
      setTimeout(() => setIsModalVisible(true), 50);
    } else {
      setIsModalVisible(false);
      // Wait for the modal to fade out before hiding the backdrop
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

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

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white dark:bg-neutral-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isModalVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment Information</h2>
          <button
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Credit Card Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Credit Card Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiration Month
                  </label>
                  <input
                    type="text"
                    name="expMonth"
                    value={formData.expMonth}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="MM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiration Year
                  </label>
                  <input
                    type="text"
                    name="expYear"
                    value={formData.expYear}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="YYYY"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CVC
                </label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cell Phone
                </label>
                <input
                  type="tel"
                  name="cellPhone"
                  value={formData.cellPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Identification
                </label>
                <input
                  type="text"
                  name="identification"
                  value={formData.identification}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Total Amount:
              </p>
              <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white px-6 py-2 rounded-md font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
