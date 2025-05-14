import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { API_ENDPOINT } from "../config";
import toast from "react-hot-toast";
import { sanitizeInput } from "../routes/signup";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string | null;
  file_url: string | null;
}

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const { isAuthenticated, authToken, user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    cover_url: "",
    file_url: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate({ to: "/" });
      return;
    }

    fetchBooks();
  }, [isAuthenticated, user, navigate]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/books`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price.toString(),
      cover_url: book.cover_url || "",
      file_url: book.file_url || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingBook
        ? `${API_ENDPOINT}/books/${editingBook.id}`
        : `${API_ENDPOINT}/books`;
      const method = editingBook ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save book");
      }

      toast.success(
        editingBook ? "Book updated successfully" : "Book created successfully"
      );
      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        description: "",
        price: "",
        cover_url: "",
        file_url: "",
      });
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("Failed to save book");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_ENDPOINT}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("Server response:", data); // Para debugging

      // Actualizar el file_url en el formulario principal
      let fileUrl = "";

      if (data.preview_url) {
        if (typeof data.preview_url === "string") {
          fileUrl = data.preview_url;
        } else if (typeof data.preview_url === "object") {
          fileUrl =
            data.preview_url.download_url || data.preview_url.preview_url || "";
        }
      }

      setFormData((prev) => ({
        ...prev,
        file_url: fileUrl,
      }));

      toast.success("File uploaded successfully");
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            setEditingBook(null);
            setFormData({
              title: "",
              author: "",
              description: "",
              price: "",
              cover_url: "",
              file_url: "",
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition duration-300"
        >
          Add New Book
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="h-48 bg-gray-200">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Cover</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {book.description}
              </p>
              <p className="text-lg font-bold mb-4">${book.price.toFixed(2)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding/editing books */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cover URL
                </label>
                <input
                  type="url"
                  name="cover_url"
                  value={formData.cover_url}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File URL
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition duration-300 whitespace-nowrap"
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition duration-300"
                >
                  {editingBook ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upload File</h2>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a file
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>

              {selectedFile && (
                <div className="text-sm text-gray-600">
                  Selected file: {selectedFile.name}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
