export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string | null;
  file_url: string | null;
  category_id: string;
  category: string;
}
