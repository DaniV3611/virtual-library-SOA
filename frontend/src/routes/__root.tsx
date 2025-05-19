import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "../components/Header";
import { AuthProvider } from "../hooks/useAuth";
import { CartProvider } from "../hooks/useCart";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              <Outlet />
              <TanStackRouterDevtools />
              <Toaster />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </>
    );
  },
});
