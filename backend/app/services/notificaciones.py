import os
from datetime import datetime
from pathlib import Path
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

class noificaciones:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
            MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
            MAIL_FROM=os.getenv("MAIL_FROM"),
            MAIL_PORT=int(os.getenv("MAIL_PORT")),
            MAIL_SERVER=os.getenv("MAIL_SERVER"),
            USE_CREDENTIALS=True,
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            TEMPLATE_FOLDER=Path(__file__).parent.parent / 'templates'
        )
        self.mailer = FastMail(self.conf)

    async def send_invoice_html_notification(self, order, payment, user, order_items):
        """
        Sends a professional HTML invoice via email using Jinja2 template
        
        Args:
            order: Order object with order data
            payment: Payment object with payment data
            user: User object with user data
            order_items: List of OrderItem with purchased books
        """
        try:
            # Calculate subtotal
            subtotal = sum(float(item.price) * item.quantity for item in order_items)
            
            # Format payment method
            payment_method = "Credit card"
            card_info = None
            if payment.card_brand and payment.card_last_four:
                card_info = f"{payment.card_brand} ending in {payment.card_last_four}"
            
            # Determine status class for styling
            status_class = "completed" if order.status.lower() == "completed" else "pending"
            if order.status.lower() in ["failed", "rejected", "canceled"]:
                status_class = "failed"
            
            # Format date
            order_date = order.created_at.strftime("%B %d, %Y at %I:%M %p")
            
            # Prepare template data
            template_data = {
                "order_id": str(order.id),
                "order_number": str(order.id)[:8].upper(),
                "order_date": order_date,
                "order_status": order.status.upper(),
                "status_class": status_class,
                "customer_name": user.name,
                "customer_email": user.email,
                "transaction_id": payment.epayco_transaction_id,
                "approval_code": payment.epayco_approval_code,
                "items": [
                    {
                        "book_title": item.book.title,
                        "book_author": item.book.author,
                        "quantity": item.quantity,
                        "price": float(item.price)
                    } for item in order_items
                ],
                "subtotal": subtotal,
                "total_amount": float(order.total_amount),
                "payment_method": payment_method,
                "card_info": card_info,
                "current_year": datetime.now().year
            }
            
            subject = f"Invoice #{str(order.id)[:8].upper()} - Virtual Library"
            
            message = MessageSchema(
                subject=subject,
                recipients=[user.email],
                template_body=template_data,
                subtype=MessageType.html
            )
            
            await self.mailer.send_message(message, template_name="invoice.html")
            print(f"HTML Invoice sent successfully to {user.email} for order {order.id}")
            
        except Exception as e:
            print(f"Error sending HTML invoice email: {e}")
            raise e

    async def send_invoice_notification(self, order, payment, user, order_items):
        """
        Sends a detailed invoice via email
        
        Args:
            order: Order object with order data
            payment: Payment object with payment data
            user: User object with user data
            order_items: List of OrderItem with purchased books
        """
        try:
            # Generate detailed book list
            books_detail = []
            subtotal = 0
            
            for item in order_items:
                item_total = float(item.price) * item.quantity
                subtotal += item_total
                books_detail.append(f"""
    • {item.book.title}
      Author: {item.book.author}
      Quantity: {item.quantity}
      Unit price: ${item.price:.2f} USD
      Subtotal: ${item_total:.2f} USD
                """.strip())
            
            books_list = '\n\n'.join(books_detail) if books_detail else 'No books were registered.'
            
            # Format payment information
            payment_method_text = "Credit card"
            if payment.card_brand and payment.card_last_four:
                payment_method_text += f" {payment.card_brand} ending in {payment.card_last_four}"
            
            # Format date
            order_date = order.created_at.strftime("%m/%d/%Y %H:%M:%S")
            
            subject = f"Invoice #{str(order.id)[:8]} - Virtual Library"
            
            body = f"""
Hello {user.name},

Thank you for your purchase at our Virtual Library!

═══════════════════════════════════════════════════════════
                         ELECTRONIC INVOICE
═══════════════════════════════════════════════════════════

ORDER INFORMATION:
• Order number: {order.id}
• Date: {order_date}
• Status: {order.status.upper()}

CUSTOMER INFORMATION:
• Name: {user.name}
• Email: {user.email}

PURCHASE DETAILS:
{books_list}

═══════════════════════════════════════════════════════════

PAYMENT SUMMARY:
• Subtotal: ${subtotal:.2f} USD
• Total paid: ${order.total_amount:.2f} USD
• Payment method: {payment_method_text}
• Transaction ID: {payment.epayco_transaction_id or 'N/A'}
• Approval code: {payment.epayco_approval_code or 'N/A'}

═══════════════════════════════════════════════════════════

Enjoy your reading!

If you have any questions about your order, please don't hesitate to contact us.

Best regards,
Virtual Library Team

═══════════════════════════════════════════════════════════
This is an automated message, please do not reply.
            """.strip()

            message = MessageSchema(
                subject=subject,
                recipients=[user.email],
                body=body,
                subtype="plain"
            )

            await self.mailer.send_message(message)
            print(f"Invoice sent successfully to {user.email} for order {order.id}")
            
        except Exception as e:
            print(f"Error sending invoice email: {e}")
            raise e

    async def send_sale_notification(self, to_email: str, client_name: str, amount: str, bill: str, books: list[str]):
        try:
            subject = "Purchase Confirmation - Virtual Library"
            books_list = '\n'.join(f'- {book}' for book in books) if books else 'No books were registered.'
            body = f"""
            Hello {client_name},

            Thank you for your purchase at our Virtual Library.
            
            Order details:
            - Invoice number: {bill}
            - Amount paid: {amount} USD
            - Books purchased:\n{books_list}

            We hope you enjoy your purchase!

            Best regards,
            Virtual Library Team
            """
            message = MessageSchema(
                subject=subject,
                recipients=[to_email],
                body=body,
                subtype="plain"
            )

            await self.mailer.send_message(message)
        except Exception as e:
                print(f"Error sending notification: {e}")

    async def send_test_email(self, to_email: str, message: str):
        try:
            subject = "Test Email - Virtual Library"
            body = message
            test_message = MessageSchema(
                subject=subject,
                recipients=[to_email],
                body=body,
                subtype="plain"
            )
            await self.mailer.send_message(test_message)
        except Exception as e:
            print(f"Error sending test email: {e}")
