import { Link, useNavigate } from "@tanstack/react-router";
import CartIcon from "./CartIcon";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import UserIcon from "./UserIcon";
import BookIcon from "./BookIcon";

const HeaderButtons = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  return (
    <aside className="flex flex-row items-center gap-4">
      <Link
        to="/books"
        className="flex items-center gap-1 text-sm hover:underline font-semibold duration-300"
      >
        <BookIcon />
        Books
      </Link>
      {isAuthenticated ? (
        <>
          <h2
            className="flex items-center gap-1 text-sm font-semibold hover:underline cursor-pointer"
            onClick={() =>
              navigate({ to: `${user?.isAdmin ? "/admin" : "/profile"}` })
            }
          >
            <UserIcon /> {user?.name}
          </h2>
          <Link to="/cart">
            <CartIcon dotVisible={cartItems.length > 0} />
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
