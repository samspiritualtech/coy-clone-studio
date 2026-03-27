import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Home } from "lucide-react";

const PinterestCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      localStorage.setItem("pinterest_code", code);
      localStorage.setItem("pinterest_connected", "true");
      localStorage.setItem("pinterest_token", "mock_access_token_xyz");
      window.dispatchEvent(new Event("pinterest_connection_change"));
    }
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl">Pinterest Connected Successfully</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {code && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Authorization Code</p>
              <p className="text-sm font-mono break-all">{code}</p>
            </div>
          )}
          {!code && (
            <p className="text-sm text-muted-foreground">
              No authorization code received. Please try connecting again.
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
