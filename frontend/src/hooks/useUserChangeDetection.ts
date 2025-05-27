import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useUserChangeDetection = () => {
  const { user, logout } = useAuth();
  const previousUserIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Skip on first mount to avoid false positive
    if (!hasInitializedRef.current) {
      if (user?.id) {
        previousUserIdRef.current = user.id;
        hasInitializedRef.current = true;
      }
      return;
    }

    // Check if user has changed
    if (
      user?.id &&
      previousUserIdRef.current &&
      user.id !== previousUserIdRef.current
    ) {
      // User has changed - show notification and clean up
      toast.info(`Switched to account: ${user.name}`, {
        description: "Previous session has been automatically closed.",
        duration: 4000,
      });

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("user-switched", {
          detail: {
            previousUserId: previousUserIdRef.current,
            currentUserId: user.id,
            currentUserName: user.name,
          },
        })
      );

      // Update the reference
      previousUserIdRef.current = user.id;
    } else if (user?.id) {
      // Same user or first time setting user
      previousUserIdRef.current = user.id;
    } else if (!user && previousUserIdRef.current) {
      // User logged out
      previousUserIdRef.current = null;
    }
  }, [user?.id, user?.name]);

  // Listen for storage events (when user changes in another tab)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "library-authToken") {
        if (event.newValue === null && event.oldValue !== null) {
          // Token was removed in another tab
          logout();
          toast.warning("You have been logged out from another tab");
        } else if (
          event.newValue !== event.oldValue &&
          event.newValue !== null
        ) {
          // Token was changed in another tab (different user login)
          window.location.reload();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout]);

  return {
    currentUserId: user?.id || null,
    previousUserId: previousUserIdRef.current,
  };
};
