import BooksCarousel from "@/components/BooksCarousel";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import HeroSection from "@/components/Landing/HeroSection";

import { useBooks } from "@/hooks/useBooks";
import { createFileRoute } from "@tanstack/react-router";
// import { useBooks } from "../hooks/useBooks";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mostPurchased, latest } = useBooks();

  // bg-gradient-to-r from-indigo-400 via-red-300 to-yellow-200 dark:bg-gradient-to-r dark:from-indigo-950 dark:via-red-950 dark:to-yellow-950

  return (
    <div className="w-full min-h-dvh flex flex-col items-center ">
      <HeroSection />
      <FeaturesSection />
      {mostPurchased.length > 0 && (
        <section className="w-full py-20 px-4 flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Most Popular Books</h2>
          <BooksCarousel books={mostPurchased} />
        </section>
      )}
      <section className="w-full py-20 px-4 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Latest Books</h2>
        <BooksCarousel books={latest} />
      </section>
    </div>
  );
}
