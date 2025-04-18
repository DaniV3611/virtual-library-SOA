import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full h-dvh flex flex-col items-center">
        <div
          className="p-2 w-full h-full flex flex-col items-center justify-center"
          style={{
            backgroundImage: "url('/library.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backgroundBlendMode: "overlay",
          }}
        >
          <h1 className="text-5xl font-extrabold text-white text-center drop-shadow-lg">
            Find your next favorite book
          </h1>
          <p className="text-white text-lg mt-4 text-center max-w-xl">
            Explore an infinite collection of digital books. Buy, download, and
            enjoy wherever and whenever you want.
          </p>
          <div className="mt-6 flex gap-4">
            <Link to="/books">
              <button className="bg-white border border-white text-black px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-300 hover:border-gray-300 cursor-pointer duration-300">
                Explore books
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-transparent border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-black cursor-pointer duration-300">
                Create account
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="p-8 w-full flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Why choose our library?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mt-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-600">
              Instant access
            </h3>
            <p className="text-gray-600">
              Download and read your books instantly from any device.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600">
              Diverse catalog
            </h3>
            <p className="text-gray-600">
              Thousands of titles from all genres for every taste.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600">
              Secure payments
            </h3>
            <p className="text-gray-600">
              Buy with complete confidence with our integrated payment gateway.
            </p>
          </div>
        </div>
      </section>

      {/* Most Read Books */}
      <section className="w-full py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            📈 Most read books
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["The Little Prince", "1984", "One Hundred Years of Solitude"].map(
              (title, idx) => (
                <div key={idx} className="bg-white shadow rounded-lg p-4">
                  <div className="h-40 bg-gray-200 mb-4 rounded" />
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-sm text-gray-500">Featured author</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="w-full py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            🆕 New releases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["Sapiens", "The Shadow of the Wind", "Project Hail Mary"].map(
              (title, idx) => (
                <div key={idx} className="bg-gray-50 shadow-md rounded-lg p-4">
                  <div className="h-40 bg-gray-200 mb-4 rounded" />
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-sm text-gray-500">New arrival</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-100 w-full py-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          Join today and start reading without limits!
        </h2>
        <Link to="/signup">
          <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 cursor-pointer duration-300">
            Create my free account
          </button>
        </Link>
      </section>
    </>
  );
}
