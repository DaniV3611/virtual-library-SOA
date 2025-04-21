import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Your orders will appear here</div>;
}
