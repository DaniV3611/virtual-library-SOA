import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "../components/Header";
import { AuthProvider } from "../hooks/useAuth";
import { CartProvider } from "../hooks/useCart";
import { useUserChangeDetection } from "../hooks/useUserChangeDetection";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

// Component that uses the user change detection hook
// This needs to be inside AuthProvider to access the auth context
function AppWithUserDetection() {
  useUserChangeDetection(); // This will handle user change detection

  return (
    <>
      <Header />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Toaster />
    </>
  );
}

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <AppWithUserDetection />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </>
    );
  },
});
