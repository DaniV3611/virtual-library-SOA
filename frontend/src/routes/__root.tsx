import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";

export const Route = createRootRoute({
  component: () => (
    <div className="w-full h-dvh overflow-auto">
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
