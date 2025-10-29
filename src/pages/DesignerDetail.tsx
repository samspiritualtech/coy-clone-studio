import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DesignerGallery } from "@/components/DesignerGallery";
import { useDesigner } from "@/hooks/useDesigners";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Instagram, Mail, Phone, Users, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DesignerDetail = () => {
  const { designerId } = useParams<{ designerId: string }>();
  const navigate = useNavigate();
  const { data: designer, isLoading } = useDesigner(designerId || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Designer not found</h1>
            <Button onClick={() => navigate('/designers')}>
              Back to Designers
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/designers')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Designers
          </Button>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={designer.profile_image}
                alt={designer.brand_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{designer.brand_name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{designer.name}</p>
                </div>
                <Badge className="instagram-gradient text-white px-4 py-2">
                  {designer.price_range}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{designer.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{designer.followers.toLocaleString()}</span>
                  <span className="text-muted-foreground">Instagram followers</span>
                </div>
              </div>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Category</h3>
                  <Badge variant="secondary">{designer.category}</Badge>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {designer.instagram_link && (
                  <Button 
                    className="w-full instagram-gradient text-white hover:opacity-90"
                    onClick={() => window.open(designer.instagram_link, '_blank')}
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    Follow on Instagram
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `mailto:${designer.email}`}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `tel:${designer.contact_number}`}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">About {designer.brand_name}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {designer.description}
            </p>
          </section>

          <DesignerGallery 
            images={designer.product_images} 
            brandName={designer.brand_name}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DesignerDetail;
