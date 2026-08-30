import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "@/hooks/use-toast";

/**
 * Opt-in card for native push notifications. Renders only inside the Android/iOS
 * app for a signed-in user — on the web build it returns null so nothing changes.
 */
export const PushNotificationOptIn = () => {
  const { isAuthenticated } = useAuth();
  const { isNative, permission, isRegistering, enablePush } = usePushNotifications();

  if (!isNative || !isAuthenticated) return null;
  if (permission === "granted") {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <BellRing className="h-5 w-5 text-primary shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Collection alerts are on</p>
            <p className="text-muted-foreground text-xs">
              You'll be notified the moment a new OGURA collection goes live.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const denied = permission === "denied";

  const handleEnable = async () => {
    const result = await enablePush();
    if (result === "granted") {
      toast({ title: "Notifications enabled", description: "We'll alert you about new collections." });
    } else if (result === "denied") {
      toast({
        title: "Notifications blocked",
        description: "Enable notifications for OGURA in your phone's app settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-3">
        {denied ? (
          <BellOff className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        )}
        <div className="flex-1 space-y-2">
          <div className="text-sm">
            <p className="font-medium">Get new collection alerts</p>
            <p className="text-muted-foreground text-xs">
              {denied
                ? "Notifications are blocked. Turn them on for OGURA in your phone's app settings."
                : "Be first to see every new OGURA drop, straight to your phone."}
            </p>
          </div>
          {!denied && (
            <Button size="sm" onClick={handleEnable} disabled={isRegistering}>
              {isRegistering ? "Enabling…" : "Enable notifications"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
