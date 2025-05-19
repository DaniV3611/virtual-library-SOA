import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "next-themes";

import { FaBook, FaUser, FaMoon, FaSun } from "react-icons/fa";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to md+
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? "bg-inherit/70 shadow-lg dark:shadow-white/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      style={{
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#">
          <span
            className="font-extrabold text-xl tracking-tight animate-hero-fade-in cursor-pointer flex items-center gap-2 group"
            onClick={() => navigate({ to: "/" })}
          >
            {/* <img
              src="/books.png"
              alt=""
              className="w-10 h-10 group-hover:animate-jelly"
            /> */}
            <FaBook className="group-hover:animate-jelly" />
            Virtual Library
          </span>
        </a>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block w-6 h-0.5 mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          ></span>
        </button>
        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 font-medium items-center">
          <Button variant="link" className="p-0">
            <Link to="/books">Books</Link>
          </Button>
          {/* Toggle de tema */}
          <Button
            variant="ghost"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </Button>
          {isAuthenticated && user ? (
            <Button variant="outline" className="">
              <FaUser />
              <Link to="/signup">{user.name}</Link>
            </Button>
          ) : (
            <Button className="">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
      {/* Mobile nav */}
      <nav
        className={`md:hidden flex flex-col bg-white/90 backdrop-blur-xl shadow-lg rounded-b-lg px-6 pt-2 pb-4 absolute w-full left-0 top-full transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Button
          variant="link"
          className="text-white"
          onClick={() => setMenuOpen(false)}
        >
          <Link className="w-full" to="/books">
            Books
          </Link>
        </Button>
        {/* Toggle de tema en mobile */}
        <Button
          variant="ghost"
          aria-label="Toggle dark mode"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </Button>
        <Button
          variant="link"
          className="text-white"
          onClick={() => setMenuOpen(false)}
        >
          <Link className="w-full" to="/login">
            Log In
          </Link>
        </Button>
      </nav>
    </header>
  );
}
