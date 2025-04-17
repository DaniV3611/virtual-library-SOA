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
            Encuentra tu próximo libro favorito
          </h1>
          <p className="text-white text-lg mt-4 text-center max-w-xl">
            Explora una colección infinita de libros digitales. Compra, descarga
            y disfruta donde y cuando quieras.
          </p>
          <div className="mt-6 flex gap-4">
            <Link to="/books">
              <button className="bg-white border border-white text-black px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-300 hover:border-gray-300 cursor-pointer duration-300">
                Explorar libros
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-transparent border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-black cursor-pointer duration-300">
                Crear cuenta
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="p-8 w-full flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          ¿Por qué elegir nuestra librería?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mt-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-600">
              Acceso instantáneo
            </h3>
            <p className="text-gray-600">
              Descarga y lee tus libros al instante desde cualquier dispositivo.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600">
              Catálogo diverso
            </h3>
            <p className="text-gray-600">
              Miles de títulos de todos los géneros para todos los gustos.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600">
              Pagos seguros
            </h3>
            <p className="text-gray-600">
              Compra con total confianza con nuestra pasarela de pagos
              integrada.
            </p>
          </div>
        </div>
      </section>

      {/* Most Read Books */}
      <section className="w-full py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            📈 Libros más leídos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["El Principito", "1984", "Cien años de soledad"].map(
              (title, idx) => (
                <div key={idx} className="bg-white shadow rounded-lg p-4">
                  <div className="h-40 bg-gray-200 mb-4 rounded" />
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-sm text-gray-500">Autor destacado</p>
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
            🆕 Nuevos lanzamientos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["Sapiens", "La sombra del viento", "Project Hail Mary"].map(
              (title, idx) => (
                <div key={idx} className="bg-gray-50 shadow-md rounded-lg p-4">
                  <div className="h-40 bg-gray-200 mb-4 rounded" />
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-sm text-gray-500">Nuevo ingreso</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-100 w-full py-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          ¡Únete hoy y empieza a leer sin límites!
        </h2>
        <Link to="/signup">
          <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 cursor-pointer duration-300">
            Crear mi cuenta gratis
          </button>
        </Link>
      </section>
    </>
  );
}
