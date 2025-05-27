import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";

const LandingButtons = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  return (
    <>
      <Button onClick={() => navigate({ to: "/books" })}>Browse Books</Button>
      {isAuthenticated ? (
        <Button variant="outline" onClick={() => navigate({ to: "/profile" })}>
          My Library
        </Button>
      ) : (
        <Button variant="outline" onClick={() => navigate({ to: "/login" })}>
          Sign In
        </Button>
      )}
    </>
  );
};

export default LandingButtons;
