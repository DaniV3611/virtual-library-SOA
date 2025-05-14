import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { API_ENDPOINT } from "../config";

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
    } catch (err: any) {
      toast.error(err.message);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex-1 flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <label className="block mb-4">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            name="name"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.email}
            placeholder="example@email.com"
            onChange={handleChange}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            minLength={6}
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium">Confirm Password</span>
          <input
            type="password"
            name="confirmPassword"
            className={`mt-1 block w-full border rounded-md px-3 py-2 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            minLength={6}
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 duration-300 cursor-pointer"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
