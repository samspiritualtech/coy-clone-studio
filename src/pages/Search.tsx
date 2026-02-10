import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <SearchX className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Coming Soon</h1>
          <p className="text-muted-foreground max-w-md">
            We're working on something amazing. Stay tuned!
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
