import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

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
            MAIL_SSL_TLS=False
        )
        self.mailer = FastMail(self.conf)

    async def send_sale_notification(self, to_email: str, client_name: str, amount: str, bill: str, books: list[str]):
        subject = "Confirmación de compra - Librería Virtual"
        books_list = '\n'.join(f'- {book}' for book in books) if books else 'No se registraron libros.'
        body = f"""
        Hola {client_name},

        Gracias por tu compra en nuestra Librería Virtual.
        
        Detalles del pedido:
        - Número de factura: {bill}
        - Monto pagado: {amount} USD
        - Libros comprados:\n{books_list}

        ¡Esperamos que disfrutes de tu compra!

        Saludos,
        Equipo Librería Virtual
        """
        message = MessageSchema(
            subject=subject,
            recipients=[to_email],
            body=body,
            subtype="plain"
        )

        await self.mailer.send_message(message)
