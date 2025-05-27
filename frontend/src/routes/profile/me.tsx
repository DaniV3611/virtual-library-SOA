import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUserSessions } from "@/hooks/useUserSessions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaSignOutAlt,
  FaTrash,
  FaSyncAlt,
  FaExclamationTriangle,
  FaKey,
} from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/me")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const {
    sessions,
    loading,
    error,
    fetchSessions,
    revokeSession,
    revokeAllSessions,
    getDeviceIcon,
    formatLastActivity,
    isCurrentSession,
  } = useUserSessions();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSession(sessionId);
  };

  const handleRevokeAllSessions = async () => {
    const success = await revokeAllSessions(true);
    if (success) {
      setConfirmDialogOpen(false);
    }
  };

  const handleRefreshSessions = () => {
    fetchSessions();
    toast.success("Sessions refreshed");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No user data available</h2>
          <p className="text-muted-foreground">Please log in again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* User Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaUser className="w-5 h-5" />
            User Information
          </CardTitle>
          <CardDescription>
            Your account details and basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FaUser className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaShieldAlt className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role</p>
                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                  {user.isAdmin ? "Administrator" : "Customer"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaKey className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FaShieldAlt className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage your active login sessions across different devices
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshSessions}
                disabled={loading}
              >
                <FaSyncAlt
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
              <Dialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={loading || sessions.length <= 1}
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Revoke All Others
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FaExclamationTriangle className="w-5 h-5 text-destructive" />
                      Confirm Action
                    </DialogTitle>
                    <DialogDescription>
                      This will log you out from all other devices and sessions.
                      Your current session will remain active. Are you sure you
                      want to continue?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRevokeAllSessions}
                    >
                      Yes, Revoke All Others
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaSyncAlt className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Loading sessions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaExclamationTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-destructive mb-2">Error loading sessions</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleRefreshSessions} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaShieldAlt className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No active sessions found
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const isCurrent = isCurrentSession(session);
                return (
                  <div
                    key={session.id}
                    className={`p-4 border rounded-lg ${
                      isCurrent
                        ? "bg-primary/5 border-primary/20"
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getDeviceIcon(session.device_type)}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {session.browser || "Unknown Browser"} on{" "}
                              {session.os || "Unknown OS"}
                            </p>
                            {isCurrent && (
                              <Badge variant="outline" className="text-xs">
                                Current Session
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {session.device_type || "Unknown Device"}
                            </span>
                            <span>•</span>
                            <span>{session.ip_address || "Unknown IP"}</span>
                            <span>•</span>
                            <span>
                              Last active:{" "}
                              {formatLastActivity(session.last_activity)}
                            </span>
                          </div>
                          {session.location && (
                            <p className="text-xs text-muted-foreground">
                              📍 {session.location}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.is_suspicious && (
                          <Badge variant="destructive" className="text-xs">
                            Suspicious
                          </Badge>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          disabled={isCurrent}
                          title={
                            isCurrent
                              ? "Cannot revoke current session"
                              : "Revoke this session"
                          }
                        >
                          <FaTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
