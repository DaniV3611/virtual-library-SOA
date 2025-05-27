import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminRedirect,
});

function AdminRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new admin panel location
    navigate({ to: "/profile/admin" });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Redirecting to admin panel...</p>
      </div>
    </div>
  );
}
