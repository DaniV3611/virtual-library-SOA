import { Link, useNavigate } from "@tanstack/react-router";
// import CartIcon from "./CartIcon";
import useAuth from "../hooks/useAuth";
// import useCart from "../hooks/useCart";
// import UserIcon from "./UserIcon";
// import BookIcon from "./BookIcon";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const HeaderButtons = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <FaUser />
              {user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to="/login">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-between group"
                onClick={logout}
              >
                <span className="group-hover:text-red-500 transition-colors">
                  Log Out
                </span>
                <FaSignOutAlt className="group-hover:text-red-500 transition-colors" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate({ to: "/login" })}>Log In</Button>
      )}
    </>
  );

  // Previous Buttons
  // return (
  //   <aside className="flex flex-row items-center gap-4">
  //     <Link
  //       to="/books"
  //       className="flex items-center gap-1 text-sm hover:underline font-semibold duration-300"
  //     >
  //       <BookIcon />
  //       Books
  //     </Link>
  //     {isAuthenticated ? (
  //       <>
  //         <h2
  //           className="flex items-center gap-1 text-sm font-semibold hover:underline cursor-pointer"
  //           onClick={() =>
  //             navigate({ to: `${user?.isAdmin ? "/admin" : "/profile"}` })
  //           }
  //         >
  //           <UserIcon /> {user?.name}
  //         </h2>
  //         <Link to="/cart">
  //           <CartIcon dotVisible={cartItems.length > 0} />
  //         </Link>
  //       </>
  //     ) : (
  //       <Link to="/login" className="text-sm hover:underline">
  //         Login
  //       </Link>
  //     )}
  //   </aside>
  // );
};

export default HeaderButtons;
