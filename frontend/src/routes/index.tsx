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

  return (
    <div className="w-full min-h-dvh flex flex-col items-center">
      <HeroSection />
      <FeaturesSection />
      <section className="w-full py-20 px-4 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Most Popular Books</h2>
        <BooksCarousel books={mostPurchased} />
      </section>
      <section className="w-full py-20 px-4 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Latest Books</h2>
        <BooksCarousel books={latest} />
      </section>
      <section className="w-full min-h-dvh"></section>
    </div>
  );
}
