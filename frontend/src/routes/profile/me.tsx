import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/me")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Profile route</div>;
}
