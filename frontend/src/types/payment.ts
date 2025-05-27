export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_method?: string;

  // ePayco information
  epayco_transaction_id?: string;
  epayco_response_code?: number;
  epayco_response_message?: string;
  epayco_approval_code?: string;
  epayco_receipt?: string;

  // Payment method information
  card_last_four?: string;
  card_brand?: string;

  // Client information
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_ip?: string;

  // Timestamps
  created_at: string;
  processed_at?: string;
  updated_at: string;

  // Order information
  order_total: number;
  order_status: string;
  order_created_at: string;
}

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
}

export type PaymentStatus =
  | "completed"
  | "pending"
  | "failed"
  | "rejected"
  | "reversed"
  | "retained"
  | "started"
  | "expired"
  | "abandoned"
  | "canceled";
