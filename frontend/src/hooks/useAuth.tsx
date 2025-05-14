import { useState, useEffect, createContext, useContext } from "react";
import { API_ENDPOINT } from "../config";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface LoginCredentials {
  username: string; // Using username because FastAPI OAuth2 expects this
  password: string;
}

interface AuthContextType {
  user: User | null;
  authToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Token storage helpers
const setToken = (token: string) => {
  localStorage.setItem("library-authToken", token);
};

const getToken = (): string | null => {
  return localStorage.getItem("library-authToken");
};

const removeToken = () => {
  localStorage.removeItem("library-authToken");
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await fetch(`${API_ENDPOINT}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              isAdmin: userData.role === "admin",
            });
            setAuthToken(token);
          } else {
            // If token is invalid, remove it
            removeToken();
          }
        } catch (err) {
          console.error("Error during auth initialization:", err);
          removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    // Check if credentials have allowed length
    if (credentials.username.length < 5 || credentials.password.length < 5) {
      setError("Username and password must be at least 5 characters long");
      setIsLoading(false);
      return;
    }
    // Check if credentials are not too long
    if (credentials.username.length > 20 || credentials.password.length > 20) {
      setError("Username and password must be at most 20 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // FormData for OAuth2 compatibility
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await fetch(`${API_ENDPOINT}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Save token
      setToken(data.access_token);
      setAuthToken(data.access_token);

      // Get user data
      const userResponse = await fetch(`${API_ENDPOINT}/users/me`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user data");
      }

      const userData = await userResponse.json();
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.role === "admin",
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    authToken,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
