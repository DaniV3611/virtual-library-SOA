export interface UserHiddenBook {
  id: string;
  user_id: string;
  book_id: string;
  hidden_at: string;
}

export interface HiddenBooksResponse {
  hidden_books: string[];
  total: number;
}

export interface ToggleBookVisibilityRequest {
  book_id: string;
  hide: boolean;
}

export interface ToggleBookVisibilityResponse {
  message: string;
  book_id: string;
  hidden: boolean;
}
