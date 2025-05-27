import {
  createFileRoute,
  Outlet,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FaBookOpen, FaList, FaCreditCard, FaUser } from "react-icons/fa";
import { Card } from "@/components/ui/card";
export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { isAuthenticated, authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your profile");
      navigate({ to: "/login" });
      return;
    }
  }, [isAuthenticated, authToken, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full h-dvh flex flex-row items-center pt-14 md:pt-13">
      <aside className="lg:w-xs h-full p-4 flex flex-col gap-2 transition-transform">
        <Button
          variant={location.pathname === "/profile" ? "secondary" : "ghost"}
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate({ to: "/profile" })}
        >
          <FaBookOpen />
          <span className="hidden lg:block">Books</span>
        </Button>
        <Button
          variant={
            location.pathname === "/profile/orders" ? "secondary" : "ghost"
          }
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate({ to: "/profile/orders" })}
        >
          <FaList />
          <span className="hidden lg:block">Orders</span>
        </Button>
        <Button
          variant={
            location.pathname === "/profile/payments" ||
            location.pathname.startsWith("/profile/payments/")
              ? "secondary"
              : "ghost"
          }
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate({ to: "/profile/payments" })}
        >
          <FaCreditCard />
          <span className="hidden lg:block">Payments</span>
        </Button>
        <Button
          variant={location.pathname === "/profile/me" ? "secondary" : "ghost"}
          className="w-full flex items-center justify-start gap-2"
          onClick={() => navigate({ to: "/profile/me" })}
        >
          <FaUser />
          <span className="hidden lg:block">Profile</span>
        </Button>
      </aside>
      <aside className="w-full h-full p-4 pl-0">
        <Card className="w-full h-full rounded-md overflow-auto p-0">
          <Outlet />
        </Card>
      </aside>
    </div>
  );
}
