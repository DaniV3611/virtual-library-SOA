import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import HeaderButtons from "./HeaderButtons";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const routerState = useRouterState();
  const isIndexRoute = routerState.location.pathname === "/";

  useEffect(() => {
    const findScrollContainer = () => {
      const container = document.querySelector(".h-dvh.overflow-auto");
      if (container) {
        scrollContainerRef.current = container as HTMLDivElement;
        return true;
      }
      return false;
    };

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target.scrollTop > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (findScrollContainer() && scrollContainerRef.current) {
      if (scrollContainerRef.current.scrollTop > 10) {
        setIsScrolled(true);
      }

      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <header
      className={`${isIndexRoute ? "fixed top-0 left-0" : ""} p-4 w-full h-16 flex flex-row items-center justify-between z-50 transition-all duration-500 ${
        isIndexRoute
          ? isScrolled
            ? "bg-white shadow-md text-black"
            : "bg-transparent text-white"
          : "text-black shadow-md bg-gray-50 sticky top-0"
      }`}
    >
      <Link to="/">
        <h1 className="text-lg font-bold text-center">Libreria Virtual</h1>
      </Link>
      <HeaderButtons />
    </header>
  );
};

export default Header;
