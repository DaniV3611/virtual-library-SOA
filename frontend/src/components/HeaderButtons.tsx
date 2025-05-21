import { Link, useNavigate } from "@tanstack/react-router";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import {
  FaCaretDown,
  FaCaretUp,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";

const HeaderButtons = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <>
          <Button
            variant="ghost"
            className="md:-ml-4 relative"
            onClick={() => navigate({ to: "/cart" })}
          >
            <span>Cart</span>
            <FaShoppingCart className="px-0"></FaShoppingCart>
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {cartItems.length}
              </span>
            )}
          </Button>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button>
                <FaUser />
                {user?.name}
                <FaCaretDown
                  className={`${open ? "rotate-180" : ""} transition-transform duration-300`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
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
        </>
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
