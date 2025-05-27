from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy import Column, DateTime, ForeignKey, Numeric, Text, String, Integer
from sqlalchemy.orm import relationship
from app.db.session import Base


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    
    # Payment amount and status
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), nullable=False)  # completed, pending, failed, etc.
    
    # ePayco payment information
    epayco_transaction_id = Column(String(100))  # ID de la transacción en ePayco
    epayco_response_code = Column(Integer)  # Código de respuesta de ePayco (1-11)
    epayco_response_message = Column(Text)  # Mensaje de respuesta de ePayco
    epayco_approval_code = Column(String(50))  # Código de aprobación del banco
    epayco_receipt = Column(String(100))  # Número de recibo de ePayco
    
    # Payment method information
    payment_method = Column(String(50), default="credit_card")  # credit_card, debit_card, etc.
    card_last_four = Column(String(4))  # Últimos 4 dígitos de la tarjeta
    card_brand = Column(String(20))  # Visa, Mastercard, etc.
    
    # Client information
    client_name = Column(String(200))
    client_email = Column(String(200))
    client_phone = Column(String(20))
    client_ip = Column(INET)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime)  # Cuando se procesó el pago
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="payments")

