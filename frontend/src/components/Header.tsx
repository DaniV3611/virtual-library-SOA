import { useState, useEffect, useRef } from "react";
import CartIcon from "./CartIcon";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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
      className={`fixed top-0 left-0 px-4 w-full h-16 flex flex-row items-center justify-between z-50 transition-all duration-500 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      } ${isScrolled ? "text-black" : "text-white"}`}
    >
      <h1 className="text-lg font-bold text-center">Library Header</h1>
      <CartIcon />
    </header>
  );
};

export default Header;
