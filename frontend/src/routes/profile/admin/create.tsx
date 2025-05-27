import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../utils/apiClient";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { ArrowLeft, Upload, File } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

export const Route = createFileRoute("/profile/admin/create")({
  component: CreateBook,
});

function CreateBook() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    cover_url: "",
    file_url: "",
    category_id: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate({ to: "/" });
      return;
    }

    fetchCategories();
  }, [isAuthenticated, user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const sanitizeInput = (value: string) => {
    return value.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);

    try {
      const response = await apiClient.fetch("/files/upload", {
        method: "POST",
        body: uploadFormData,
        headers: {}, // Remove Content-Type to let browser set it for FormData
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("Server response:", data);

      // Update the file_url in the main form
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.author ||
      !formData.description ||
      !formData.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiClient.post("/books", {
        ...formData,
        price: parseFloat(formData.price),
      });

      if (!response.ok) {
        throw new Error("Failed to create book");
      }

      toast.success("Book created successfully");
      navigate({ to: "/profile/admin" });
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Failed to create book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/profile/admin" })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Create New Book</h1>
        <p className="text-muted-foreground">Add a new book to your library</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
          <CardDescription>
            Fill in the details for the new book
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium">
                Author *
              </label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category_id" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover URL */}
            <div className="space-y-2">
              <label htmlFor="cover_url" className="text-sm font-medium">
                Cover Image URL
              </label>
              <Input
                id="cover_url"
                name="cover_url"
                type="url"
                value={formData.cover_url}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            {/* File URL */}
            <div className="space-y-2">
              <label htmlFor="file_url" className="text-sm font-medium">
                Book File URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="file_url"
                  name="file_url"
                  type="url"
                  value={formData.file_url}
                  onChange={handleChange}
                  placeholder="https://example.com/book.pdf"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="whitespace-nowrap"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/profile/admin" })}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Book"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Upload File Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Upload Book File
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
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
              <div className="text-sm text-muted-foreground">
                Selected file: {selectedFile.name}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
