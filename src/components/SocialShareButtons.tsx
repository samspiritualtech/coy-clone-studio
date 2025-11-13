import { MessageCircle, Facebook, Twitter, Mail, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";

interface SocialShareButtonsProps {
  show: boolean;
}

export const SocialShareButtons = ({ show }: SocialShareButtonsProps) => {
  if (!show) return null;

  const shareUrl = window.location.href;
  const shareText = "Check out OGURA Fashion - Amazing deals and rewards!";

  const shareButtons = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: '#25D366'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: '#1877F2'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: '#1DA1F2'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent('Check out OGURA Fashion')}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: '#EA4335'
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share link copied to clipboard",
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-center gap-3 sm:gap-4 mb-4 flex-wrap">
        {shareButtons.map((btn) => (
          <a
            key={btn.name}
            href={btn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: btn.color }}
            >
              <btn.icon className="h-6 w-6" />
            </div>
            <span className="text-xs text-muted-foreground">{btn.name}</span>
          </a>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input 
          value={shareUrl}
          readOnly
          className="flex-1 text-sm"
        />
        <Button
          variant="outline"
          onClick={handleCopyLink}
          size="icon"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
