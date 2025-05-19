import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaBolt } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "../ui/card";

const FeaturesSection = () => {
  return (
    <section className="w-full py-20 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Why to choose our library?</h2>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full px-4">
        <Card className="w-full max-w-md lg:w-md shadow-lg dark:shadow-white/10 hover:scale-105 transition-transform group">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <FaBolt className="text-3xl text-primary group-hover:animate-bouncing" />
            <h3 className="text-lg font-bold">Acceso Instantáneo</h3>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Obtén acceso instantáneo a tus libros favoritos con nuestra
              biblioteca. Descárgalos y léelos en cualquier dispositivo, en
              cualquier lugar y momento.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-md lg:w-md shadow-lg dark:shadow-white/10 hover:scale-105 transition-transform group">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <FaBookOpen className="text-3xl text-primary group-hover:animate-bouncing" />
            <h3 className="text-lg font-bold">Colección Ilimitada</h3>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Explora una colección infinita de libros digitales para todos los
              gustos y edades. Siempre encontrarás algo nuevo para leer.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-md lg:w-md shadow-lg dark:shadow-white/10 hover:scale-105 transition-transform group">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <FaCloudDownloadAlt className="text-3xl text-primary group-hover:animate-bouncing" />
            <h3 className="text-lg font-bold">Descargas Fáciles</h3>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Descarga tus libros favoritos de manera rápida y sencilla.
              Llévalos contigo y disfruta de la lectura sin límites.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;
