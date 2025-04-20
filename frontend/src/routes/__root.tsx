import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../hooks/useAuth";
import { CartProvider } from "../hooks/useCart";

export const Route = createRootRoute({
  component: () => {
    const routerState = useRouterState();
    const isIndexRoute = routerState.location.pathname === "/";
    return (
      <div
        className={`w-full h-dvh overflow-auto ${
          isIndexRoute ? "" : "flex flex-col"
        }`}
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            <Outlet />
            <TanStackRouterDevtools />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgba(101, 101, 101, 0.8)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "16px",
                },
                success: {
                  iconTheme: {
                    primary: "#4CAF50",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#f44336",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </div>
    );
  },
});
