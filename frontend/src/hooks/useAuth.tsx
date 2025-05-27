import { useState, useEffect, createContext, useContext } from "react";
import { apiClient } from "../utils/apiClient";
import { toast } from "sonner";
import { encryptCredentials, getServerPublicKey } from "../utils/encryption";

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
          const response = await apiClient.get("/users/me");

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
            setAuthToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error("Error during auth initialization:", err);
          removeToken();
          setAuthToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Listen for session revocation events
  useEffect(() => {
    const handleSessionRevoked = (event: CustomEvent) => {
      const { message } = event.detail;

      // Clear auth state
      setUser(null);
      setAuthToken(null);
      setError("Your session has been revoked from another device");

      // Show notification
      toast.error(message || "Session has been revoked", {
        description: "You have been logged out. Please log in again.",
        duration: 5000,
      });
    };

    window.addEventListener(
      "session-revoked",
      handleSessionRevoked as EventListener
    );

    return () => {
      window.removeEventListener(
        "session-revoked",
        handleSessionRevoked as EventListener
      );
    };
  }, []);

  // Login function with encrypted credentials
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
      // 1. Get the server's public key
      const publicKey = await getServerPublicKey();

      // 2. Encrypt the credentials
      const encryptedCredentials = encryptCredentials(credentials, publicKey);

      // 3. Send encrypted credentials to the server
      const response = await apiClient.post(
        "/auth/login-encrypted",
        encryptedCredentials
      );

      if (!response.ok) {
        // Handle different error status codes
        let errorMessage = "Login failed";

        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use status-based message
          if (response.status === 401) {
            errorMessage = "Incorrect email or password";
          } else if (response.status === 400) {
            errorMessage = "Invalid request data";
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Save token
      setToken(data.access_token);
      setAuthToken(data.access_token);

      // Get user data
      const userResponse = await apiClient.get("/users/me");

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
