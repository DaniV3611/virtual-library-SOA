from fastapi import APIRouter, Query
from typing import List
from datetime import datetime, timedelta
from sqlalchemy import func, desc
from decimal import Decimal

from app.api.dependencies.session import SessionDep
from app.api.dependencies.deps import UserIsAdminDep
from app.models.order import Order
from app.models.payment import Payment
from app.schemas.order import OrderOut
from pydantic import BaseModel


router = APIRouter()


class AdminStatsResponse(BaseModel):
    total_books: int
    total_sales: int  # Number of completed orders
    total_revenue: Decimal  # Sum of completed payments
    total_orders: int  # Total number of orders


class RecentOrdersResponse(BaseModel):
    orders: List[OrderOut]
    total: int


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    session: SessionDep,
    current_user: UserIsAdminDep
):
    """
    Get admin dashboard statistics
    """
    from app.models.book import Book
    
    # Get total books count
    total_books = session.query(Book).count()
    
    # Get total sales (completed orders)
    total_sales = session.query(Order).filter(Order.status == "completed").count()
    
    # Get total revenue (sum of completed payments)
    total_revenue_result = session.query(
        func.sum(Payment.amount)
    ).filter(
        Payment.status == "completed"
    ).scalar()
    
    total_revenue = total_revenue_result if total_revenue_result else Decimal('0.00')
    
    # Get total orders count
    total_orders = session.query(Order).count()
    
    return AdminStatsResponse(
        total_books=total_books,
        total_sales=total_sales,
        total_revenue=total_revenue,
        total_orders=total_orders
    )


@router.get("/recent-orders", response_model=RecentOrdersResponse)
def get_recent_orders(
    session: SessionDep,
    current_user: UserIsAdminDep,
    limit: int = Query(10, ge=1, le=100, description="Number of recent orders to return"),
    skip: int = Query(0, ge=0, description="Number of orders to skip")
):
    """
    Get recent orders for admin dashboard
    """
    # Get recent orders with pagination
    orders_query = session.query(Order).order_by(desc(Order.created_at))
    
    total = orders_query.count()
    orders = orders_query.offset(skip).limit(limit).all()
    
    return RecentOrdersResponse(
        orders=orders,
        total=total
    )


@router.get("/sales-summary")
def get_sales_summary(
    session: SessionDep,
    current_user: UserIsAdminDep,
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze")
):
    """
    Get sales summary for the specified number of days
    """
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Get sales data within date range
    sales_in_period = session.query(Order).filter(
        Order.status == "completed",
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).count()
    
    # Get revenue data within date range
    revenue_in_period_result = session.query(
        func.sum(Payment.amount)
    ).join(Order, Payment.order_id == Order.id).filter(
        Payment.status == "completed",
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).scalar()
    
    revenue_in_period = revenue_in_period_result if revenue_in_period_result else Decimal('0.00')
    
    # Get daily sales breakdown
    daily_sales = session.query(
        func.date(Order.created_at).label('date'),
        func.count(Order.id).label('sales_count'),
        func.sum(Order.total_amount).label('daily_revenue')
    ).filter(
        Order.status == "completed",
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).group_by(
        func.date(Order.created_at)
    ).order_by(
        func.date(Order.created_at)
    ).all()
    
    return {
        "period_days": days,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "total_sales_in_period": sales_in_period,
        "total_revenue_in_period": float(revenue_in_period),
        "daily_breakdown": [
            {
                "date": str(day.date),
                "sales_count": day.sales_count,
                "revenue": float(day.daily_revenue) if day.daily_revenue else 0.0
            }
            for day in daily_sales
        ]
    }


@router.get("/top-selling-books")
def get_top_selling_books(
    session: SessionDep,
    current_user: UserIsAdminDep,
    limit: int = Query(10, ge=1, le=50, description="Number of top books to return")
):
    """
    Get top selling books based on completed orders
    """
    from app.models.book import Book
    from app.models.order_item import OrderItem
    
    # Query to get books with their sales count
    top_books = session.query(
        Book.id,
        Book.title,
        Book.author,
        Book.price,
        Book.cover_url,
        func.count(OrderItem.id).label('sales_count'),
        func.sum(OrderItem.quantity).label('total_quantity_sold')
    ).join(
        OrderItem, Book.id == OrderItem.book_id
    ).join(
        Order, OrderItem.order_id == Order.id
    ).filter(
        Order.status == "completed"
    ).group_by(
        Book.id, Book.title, Book.author, Book.price, Book.cover_url
    ).order_by(
        desc('sales_count')
    ).limit(limit).all()
    
    return {
        "top_selling_books": [
            {
                "id": str(book.id),
                "title": book.title,
                "author": book.author,
                "price": float(book.price),
                "cover_url": book.cover_url,
                "sales_count": book.sales_count,
                "total_quantity_sold": book.total_quantity_sold
            }
            for book in top_books
        ]
    }


@router.get("/payment-methods-summary")
def get_payment_methods_summary(
    session: SessionDep,
    current_user: UserIsAdminDep
):
    """
    Get summary of payment methods used
    """
    payment_methods = session.query(
        Payment.payment_method,
        func.count(Payment.id).label('count'),
        func.sum(Payment.amount).label('total_amount')
    ).filter(
        Payment.status == "completed"
    ).group_by(
        Payment.payment_method
    ).all()
    
    return {
        "payment_methods": [
            {
                "method": method.payment_method or "unknown",
                "count": method.count,
                "total_amount": float(method.total_amount) if method.total_amount else 0.0
            }
            for method in payment_methods
        ]
    } 