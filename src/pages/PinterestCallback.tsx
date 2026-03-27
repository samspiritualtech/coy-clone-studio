import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Home, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PinterestCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    code ? "loading" : "error"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!code) return;

    const exchangeToken = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/pinterest/callback`;
        const { data, error } = await supabase.functions.invoke(
          "pinterest-token-exchange",
          { body: { code, redirect_uri: redirectUri } }
        );

        if (error || !data?.access_token) {
          throw new Error(error?.message || data?.error || "Token exchange failed");
        }

        localStorage.setItem("pinterest_token", data.access_token);
        localStorage.setItem("pinterest_connected", "true");
        localStorage.setItem("pinterest_code", code);
        window.dispatchEvent(new Event("pinterest_connection_change"));
        setStatus("success");

        setTimeout(() => navigate("/"), 2000);
      } catch (err: any) {
        console.error("Pinterest token exchange error:", err);
        setErrorMsg(err.message || "Failed to connect Pinterest");
        setStatus("error");
      }
    };

    exchangeToken();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {status === "loading" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Connecting Pinterest…</CardTitle>
            </>
          )}
          {status === "success" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Pinterest Connected Successfully</CardTitle>
            </>
          )}
          {status === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Connection Failed</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <p className="text-sm text-muted-foreground">Redirecting to home…</p>
          )}
          {status === "error" && (
            <p className="text-sm text-muted-foreground">
              {errorMsg || "No authorization code received. Please try connecting again."}
            </p>
          )}
          <Button onClick={() => navigate("/")} className="w-full gap-2">
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinterestCallback;
