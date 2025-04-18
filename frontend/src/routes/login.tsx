import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login, user, isAuthenticated, logout } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setMessage(`You are already logged in as ${user.name}`);
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await login({
        username: formData.email, // FastAPI OAuth2 expects 'username'
        password: formData.password,
      });

      toast.success("Login successful!");
      navigate({ to: "/" });
    } catch (err: any) {
      setMessage(err.message || "Invalid email or password");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setMessage("");
  };

  return (
    <section className="w-full flex-1 flex items-center justify-center bg-gray-50 px-4">
      {isAuthenticated && user ? (
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Already Logged In</h2>
          <p className="mb-6">
            You are currently logged in as <strong>{user.name}</strong>
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer bg-red-600 text-white py-2 rounded-md hover:bg-red-700 duration-300"
            >
              Log Out
            </button>
            <Link
              to="/"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 duration-300 flex items-center justify-center"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

          <label className="block mb-4">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              name="email"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.email}
              placeholder="your@email.com"
              onChange={handleChange}
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              name="password"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 duration-300 cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-red-600">{message}</p>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
