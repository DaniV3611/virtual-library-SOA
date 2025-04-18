import { Link } from "@tanstack/react-router";
import CartIcon from "./CartIcon";
import useAuth from "../hooks/useAuth";

const HeaderButtons = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <aside className="flex flex-row items-center gap-4">
      {isAuthenticated ? (
        <>
          <h2>{user?.name}</h2>
          <Link to="/cart">
            <CartIcon />
          </Link>
        </>
      ) : (
        <Link to="/login" className="text-sm hover:underline">
          Login
        </Link>
      )}
    </aside>
  );
};

export default HeaderButtons;
