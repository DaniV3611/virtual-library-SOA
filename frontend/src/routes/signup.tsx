import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { API_ENDPOINT } from "../config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";

// Sanitiza un string eliminando etiquetas HTML y caracteres peligrosos
export function sanitizeInput(input: string): string {
  let sanitized = input.replace(/<.*?>/g, ""); // elimina etiquetas HTML
  sanitized = sanitized.replace(/["'`;]/g, ""); // elimina comillas y punto y coma
  sanitized = sanitized.replace(/--/g, ""); // elimina doble guion
  return sanitized.trim();
}

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: sanitizeInput(value) });

    // Clear password error when either password field changes
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Remove confirmPassword from data sent to API
      const { confirmPassword, ...apiData } = formData;

      const res = await fetch(`${API_ENDPOINT}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const data = await res.json();

      if (res.status === 400) {
        throw new Error(data.detail || "Error creating account");
      }

      if (!res.ok) {
        throw new Error("Error creating account");
      }

      toast.success("Account created successfully 🎉");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-dvh flex flex-col items-center gap-4 pt-20 drop-shadow-md">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80 max-w-full"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Name</span>
          <Input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={formData.email}
            placeholder="example@email.com"
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Confirm Password</span>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm your password"
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
            className={passwordError ? "border-red-500" : ""}
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {passwordError}
            </p>
          )}
        </label>
        {message && (
          <p className="text-red-600 dark:text-red-400 text-sm -mb-2 w-full text-center">
            {message}
          </p>
        )}
        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
      <p className="-mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0"
          onClick={() => navigate({ to: "/login" })}
        >
          Log In
        </Button>
      </p>
    </div>
  );
}
