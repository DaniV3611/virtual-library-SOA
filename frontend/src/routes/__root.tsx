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
    <div className="relative min-h-screen">
      {/* Background with gradients for light and dark modes */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"></div>

      {/* Animated decorative background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl dark:bg-blue-800/20 animate-float-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl dark:bg-indigo-800/20 animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl dark:bg-slate-800/30 animate-pulse-slow"></div>

        {/* Additional floating orbs for more dynamic movement */}
        <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl dark:bg-cyan-800/15 animate-float-diagonal"></div>
        <div className="absolute bottom-1/3 left-1/5 w-64 h-64 bg-pink-200/20 rounded-full blur-2xl dark:bg-pink-800/15 animate-float-up-down"></div>
      </div>

      <Header />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Toaster richColors />
    </div>
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
