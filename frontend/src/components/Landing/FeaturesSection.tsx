import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaBolt } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "../ui/card";

const FeaturesSection = () => {
  return (
    <section className="w-full py-20 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Why choose our library?</h2>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full px-4">
        <Card className="w-full max-w-md lg:w-md shadow-lg dark:shadow-white/10 hover:scale-105 transition-transform group">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <FaBolt className="text-3xl text-primary group-hover:animate-bouncing" />
            <h3 className="text-lg font-bold">Instant Access</h3>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Get instant access to your favorite books with our library.
              Download and read them on any device, anywhere, anytime.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-md lg:w-md shadow-lg dark:shadow-white/10 hover:scale-105 transition-transform group">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <FaBookOpen className="text-3xl text-primary group-hover:animate-bouncing" />
            <h3 className="text-lg font-bold">Unlimited Collection</h3>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Explore an endless collection of digital books for all tastes and
              ages. You will always find something new to read.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-md lg:w-md shadow-lg dark:shadow-white/10 hover:scale-105 transition-transform group">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <FaCloudDownloadAlt className="text-3xl text-primary group-hover:animate-bouncing" />
            <h3 className="text-lg font-bold">Easy Downloads</h3>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Download your favorite books quickly and easily. Take them with
              you and enjoy reading without limits.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;
