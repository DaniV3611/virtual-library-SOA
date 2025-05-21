import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Sanitiza un string eliminando etiquetas HTML y caracteres peligrosos
export function sanitizeInput(input: string): string {
  let sanitized = input.replace(/<.*?>/g, ""); // elimina etiquetas HTML
  sanitized = sanitized.replace(/["'`;]/g, ""); // elimina comillas y punto y coma
  sanitized = sanitized.replace(/--/g, ""); // elimina doble guion
  return sanitized.trim();
}

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
    setFormData({
      ...formData,
      [e.target.name]: sanitizeInput(e.target.value),
    });
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
    <div className="w-full min-h-dvh flex flex-col items-center pt-20 gap-4">
      {isAuthenticated && user ? (
        <>
          <h1 className="text-2xl font-bold drop-shadow-md">
            Logged in as {user.name}
          </h1>
          <Button variant="destructive" onClick={handleLogout}>
            Log Out
          </Button>
          <Button variant="secondary" onClick={() => navigate({ to: "/" })}>
            Go to Home Page
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold drop-shadow-md">
            Log In to your account
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-80 max-w-full"
          >
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Email</span>
              <Input
                type="email"
                name="email"
                value={formData.email}
                placeholder="email@example.com"
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
                autoComplete="current-password"
              />
            </label>
            {message && (
              <p className="text-red-600 dark:text-red-400 text-sm w-full text-center">
                {message}
              </p>
            )}
            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          <p className="-mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate({ to: "/signup" })}
            >
              Sign Up
            </Button>
          </p>
        </>
      )}
    </div>
  );

  // Last version
  // return (
  //   <section className="w-full flex-1 flex items-center justify-center bg-gray-50 px-4">
  //     {isAuthenticated && user ? (
  //       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
  //         <h2 className="text-2xl font-bold mb-6">Already Logged In</h2>
  //         <p className="mb-6">
  //           You are currently logged in as <strong>{user.name}</strong>
  //         </p>
  //         <div className="flex flex-col gap-4">
  //           <button
  //             onClick={handleLogout}
  //             className="w-full cursor-pointer bg-red-600 text-white py-2 rounded-md hover:bg-red-700 duration-300"
  //           >
  //             Log Out
  //           </button>
  //           <Link
  //             to="/"
  //             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 duration-300 flex items-center justify-center"
  //           >
  //             Go to Home Page
  //           </Link>
  //         </div>
  //       </div>
  //     ) : (
  //       <form
  //         onSubmit={handleSubmit}
  //         className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
  //       >
  //         <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

  //         <label className="block mb-4">
  //           <span className="text-sm font-medium">Email</span>
  //           <input
  //             type="email"
  //             name="email"
  //             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
  //             value={formData.email}
  //             placeholder="your@email.com"
  //             onChange={handleChange}
  //             required
  //           />
  //         </label>

  //         <label className="block mb-6">
  //           <span className="text-sm font-medium">Password</span>
  //           <input
  //             type="password"
  //             name="password"
  //             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
  //             value={formData.password}
  //             onChange={handleChange}
  //             required
  //             placeholder="Password"
  //           />
  //         </label>

  //         <button
  //           type="submit"
  //           disabled={loading}
  //           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 duration-300 cursor-pointer"
  //         >
  //           {loading ? "Logging in..." : "Log In"}
  //         </button>

  //         {message && (
  //           <p className="mt-4 text-center text-sm text-red-600">{message}</p>
  //         )}

  //         <div className="mt-6 text-center">
  //           <p className="text-sm text-gray-600">
  //             Don't have an account?{" "}
  //             <Link
  //               to="/signup"
  //               className="text-blue-600 hover:text-blue-800 font-medium"
  //             >
  //               Sign Up
  //             </Link>
  //           </p>
  //         </div>
  //       </form>
  //     )}
  //   </section>
  // );
}
