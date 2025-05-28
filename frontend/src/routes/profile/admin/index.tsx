import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../utils/apiClient";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string | null;
  file_url: string | null;
  category: string;
}

interface AdminStats {
  totalBooks: number;
  totalSales: number;
  totalRevenue: number;
  recentOrders: number;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  client_name: string;
  order_total: number;
}

export const Route = createFileRoute("/profile/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBooks: 0,
    totalSales: 0,
    totalRevenue: 0,
    recentOrders: 0,
  });
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate({ to: "/" });
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch admin stats from new endpoint
      const statsResponse = await apiClient.get("/admin/stats");
      if (!statsResponse.ok) throw new Error("Failed to fetch admin stats");
      const statsData = await statsResponse.json();

      // Fetch recent orders from new endpoint
      const ordersResponse = await apiClient.get(
        "/admin/recent-orders?limit=5"
      );
      if (!ordersResponse.ok) throw new Error("Failed to fetch recent orders");
      // Note: ordersData could be used in the future for recent orders display
      await ordersResponse.json();

      // Fetch recent payments (keeping existing endpoint)
      const paymentsResponse = await apiClient.get("/orders/payments?limit=5");
      if (!paymentsResponse.ok) throw new Error("Failed to fetch payments");
      const paymentsData = await paymentsResponse.json();
      setRecentPayments(paymentsData.payments || []);

      // Fetch books for the recent books section
      const booksResponse = await apiClient.get("/books?limit=5");
      if (!booksResponse.ok) throw new Error("Failed to fetch books");
      const booksData = await booksResponse.json();
      setBooks(booksData);

      // Set stats from the admin endpoint
      setStats({
        totalBooks: statsData.total_books,
        totalSales: statsData.total_sales,
        totalRevenue: parseFloat(statsData.total_revenue),
        recentOrders: statsData.total_orders,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    setSelectedBookId(bookId);
    setIsConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedBookId) return;

    try {
      const response = await apiClient.delete(`/books/${selectedBookId}`);
      if (!response.ok) throw new Error("Failed to delete book");

      toast.success("Book deleted successfully");
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    } finally {
      setSelectedBookId(null);
      setIsConfirmingDelete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your library and track performance
          </p>
        </div>
        <Link to="/profile/admin/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">Books in library</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">From all sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Books
            </CardTitle>
            <CardDescription>Latest books in your library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.slice(0, 5).map((book) => (
                <div key={book.id} className="flex items-center space-x-4">
                  <div className="h-12 w-8 bg-gray-200 rounded overflow-hidden">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">
                      by {book.author}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">${book.price.toFixed(2)}</Badge>
                    <div className="flex space-x-1">
                      <Link to="/profile/admin/$id" params={{ id: book.id }}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {books.length > 5 && (
              <div className="mt-4 text-center">
                <Link to="/profile/admin/books">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Books
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Payments
            </CardTitle>
            <CardDescription>Latest customer payments</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.client_name || "N/A"}
                      </TableCell>
                      <TableCell>
                        ${(Number(payment.amount) || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent payments found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
