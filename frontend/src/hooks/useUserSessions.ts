import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { apiClient } from "../utils/apiClient";
import {
  UserSession,
  UserSessionsResponse,
  RevokeSessionRequest,
  RevokeSessionResponse,
  RevokeAllSessionsResponse,
} from "../types/userSession";
import { toast } from "sonner";

export const useUserSessions = () => {
  const { authToken } = useAuth();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionToken, setCurrentSessionToken] = useState<string | null>(
    null
  );

  // Set current session token when auth token changes
  useEffect(() => {
    if (authToken) {
      setCurrentSessionToken(authToken);
    }
  }, [authToken]);

  // Fetch user sessions
  const fetchSessions = useCallback(
    async (activeOnly: boolean = true) => {
      if (!authToken) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get(
          `/users/sessions?active_only=${activeOnly}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UserSessionsResponse = await response.json();
        setSessions(data.sessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch sessions"
        );
        toast.error("Error loading sessions");
      } finally {
        setLoading(false);
      }
    },
    [authToken]
  );

  // Revoke a specific session
  const revokeSession = async (sessionId: string): Promise<boolean> => {
    if (!authToken) {
      toast.error("No authentication token available");
      return false;
    }

    // Prevent revoking current session
    const sessionToRevoke = sessions.find((s) => s.id === sessionId);
    if (
      sessionToRevoke &&
      sessionToRevoke.session_token === currentSessionToken
    ) {
      toast.error("Cannot revoke the current session");
      return false;
    }

    try {
      const requestBody: RevokeSessionRequest = { session_id: sessionId };

      const response = await apiClient.post(
        `/users/sessions/revoke`,
        requestBody
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to revoke session");
      }

      const data: RevokeSessionResponse = await response.json();
      toast.success(data.message);

      // Refresh sessions list
      await fetchSessions();
      return true;
    } catch (err) {
      console.error("Error revoking session:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to revoke session";
      toast.error(errorMessage);
      return false;
    }
  };

  // Revoke all sessions except current
  const revokeAllSessions = async (
    keepCurrent: boolean = true
  ): Promise<boolean> => {
    if (!authToken) {
      toast.error("No authentication token available");
      return false;
    }

    try {
      const response = await apiClient.post(
        `/users/sessions/revoke-all?keep_current=${keepCurrent}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to revoke sessions");
      }

      const data: RevokeAllSessionsResponse = await response.json();
      toast.success(data.message);

      // Refresh sessions list
      await fetchSessions();
      return true;
    } catch (err) {
      console.error("Error revoking all sessions:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to revoke all sessions";
      toast.error(errorMessage);
      return false;
    }
  };

  // Get device icon based on device type
  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return "📱";
      case "tablet":
        return "📱";
      case "desktop":
        return "💻";
      default:
        return "🖥️";
    }
  };

  // Format last activity time
  const formatLastActivity = (lastActivity: string) => {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  // Check if session is current
  const isCurrentSession = (session: UserSession) => {
    return session.session_token === currentSessionToken;
  };

  // Load sessions on mount
  useEffect(() => {
    if (authToken) {
      fetchSessions();
    }
  }, [authToken, fetchSessions]);

  // Listen for user switch events to refresh sessions
  useEffect(() => {
    const handleUserSwitch = () => {
      // Reset sessions state and refetch for new user
      setSessions([]);
      if (authToken) {
        fetchSessions();
      }
    };

    window.addEventListener("user-switched", handleUserSwitch);
    return () => window.removeEventListener("user-switched", handleUserSwitch);
  }, [authToken, fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    revokeSession,
    revokeAllSessions,
    getDeviceIcon,
    formatLastActivity,
    isCurrentSession,
  };
};
