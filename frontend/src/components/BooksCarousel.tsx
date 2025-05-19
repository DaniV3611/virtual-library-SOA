import { CardFooter } from "./ui/card";
import { CardContent } from "./ui/card";
import { CardDescription } from "./ui/card";
import { CardTitle } from "./ui/card";
import { CardHeader } from "./ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card } from "./ui/card";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string | null;
  file_url: string | null;
}

interface Props {
  books: Book[];
}

const BooksCarousel = ({ books }: Props) => {
  return (
    <Carousel
      className="w-full max-w-md lg:max-w-11/12 mx-auto"
      plugins={[Autoplay({ delay: 10000 })]}
      opts={{
        align: "start",
      }}
    >
      <CarouselContent>
        {books?.map((book) => (
          <CarouselItem
            key={book.id}
            className="basis-full lg:basis-1/2 xl:basis-1/3"
          >
            <Card className="">
              <CardHeader>
                <CardTitle className="text-center">{book.title}</CardTitle>
                <CardDescription
                  className="text-center line-clamp-3"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {book.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <img
                  src={book.cover_url ?? ""}
                  alt={book.title}
                  className="aspect-[2/3] h-72 object-cover rounded-sm"
                />
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-sm font-semibold">$ {book.price}</span>
                <span className="text-sm flex gap-1">
                  by <p className="text-extrabold">{book.author}</p>
                </span>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default BooksCarousel;
