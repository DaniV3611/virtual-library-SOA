import LandingButtons from "./LandingButtons";

const HeroSection = () => {
  //   bg-gradient-to-br from-blue-200 via-indigo-200 to-green-200 dark:bg-gradient-to-br dark:from-blue-950 dark:via-indigo-950 dark:to-green-950

  return (
    <section className="w-full h-dvh flex flex-col md:flex-row items-center justify-center gap-4">
      <img
        src="/books_stack.png"
        alt="Virtual Library"
        className="w-1/3 md:w-1/5 object-contain animate-fade-in-right"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-extrabold z-10 drop-shadow-lg animate-fade-in-up">
          Find your next favourite book
        </h1>
        <span className="text-gray-700 dark:text-gray-300 text-center animate-fade-in-left animate-delay-300">
          Explore an infinite collection of digital books.{" "}
          <strong>Buy, download, and enjoy</strong> wherever and whenever you
          want.
        </span>
        <div className="flex flex-row items-center justify-center gap-2 animate-fade-in animate-delay-900">
          <LandingButtons />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
