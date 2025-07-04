import { API_ENDPOINT } from "../config";

// Storage helpers
const getToken = (): string | null => {
  return localStorage.getItem("library-authToken");
};

const removeToken = () => {
  localStorage.removeItem("library-authToken");
};

// Enhanced fetch wrapper with session validation
export const apiClient = {
  async fetch(url: string, options: RequestInit = {}) {
    const token = getToken();

    // Don't set Content-Type for FormData - let browser set it automatically
    const isFormData = options.body instanceof FormData;

    // Add authorization header if token exists
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const fullUrl = url.startsWith("http") ? url : `${API_ENDPOINT}${url}`;

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      // Handle session revocation/expiration only for authenticated requests
      if (response.status === 401 && token) {
        // Clone the response to read it without consuming the original stream
        const responseClone = response.clone();

        try {
          const errorData = await responseClone.json();

          // Check if it's a session-related error
          if (
            errorData.detail?.includes("Session has been revoked") ||
            errorData.detail?.includes("expired") ||
            errorData.detail?.includes("Could not validate credentials")
          ) {
            // Remove invalid token
            removeToken();

            // Dispatch custom event to notify auth context
            window.dispatchEvent(
              new CustomEvent("session-revoked", {
                detail: {
                  message: errorData.detail || "Session has been revoked",
                  reason: "session-invalid",
                },
              })
            );

            // Reload page to trigger auth check
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } catch (jsonError) {
          // If we can't parse JSON, it's likely not a session error
          console.warn("Could not parse 401 error response:", jsonError);
        }
      }

      return response;
    } catch (error) {
      console.error("API Client Error:", error);
      throw error;
    }
  },

  async get(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: "GET" });
  },

  async post(url: string, data?: unknown, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put(url: string, data?: unknown, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: "DELETE" });
  },
};
