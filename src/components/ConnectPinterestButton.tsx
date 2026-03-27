import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, LinkIcon, Unlink } from "lucide-react";

// Pinterest Client ID is a public/publishable key, safe to use client-side.
// The secret is fetched from the edge function environment at runtime.
const PINTEREST_CLIENT_ID = import.meta.env.VITE_PINTEREST_CLIENT_ID || "";

export const ConnectPinterestButton = () => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(
    () => localStorage.getItem("pinterest_connected") === "true"
  );

  if (!isAuthenticated) return null;

  const handleConnect = () => {
    if (!PINTEREST_CLIENT_ID) {
      console.warn("Pinterest Client ID not configured");
    }
    const redirectUri = `${window.location.origin}/auth/pinterest/callback`;
    const scope = "boards:read,pins:read";
    const oauthUrl = `https://www.pinterest.com/oauth/?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${PINTEREST_CLIENT_ID}&scope=${scope}`;
    window.location.href = oauthUrl;
  };

  const handleDisconnect = () => {
    localStorage.removeItem("pinterest_connected");
    localStorage.removeItem("pinterest_token");
    localStorage.removeItem("pinterest_code");
    setIsConnected(false);
    window.dispatchEvent(new Event("pinterest_connection_change"));
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400">
          <Check className="h-3 w-3" />
          Pinterest Connected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="text-muted-foreground hover:text-destructive h-8 px-2"
        >
          <Unlink className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      size="sm"
      className="bg-[hsl(350,80%,45%)] hover:bg-[hsl(350,80%,38%)] text-white gap-1.5"
    >
      <LinkIcon className="h-3.5 w-3.5" />
      Connect Pinterest
    </Button>
  );
};
