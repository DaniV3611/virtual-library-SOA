import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../hooks/useAuth";

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
          <Header />
          <Outlet />
          <TanStackRouterDevtools />
          <Toaster />
        </AuthProvider>
      </div>
    );
  },
});
