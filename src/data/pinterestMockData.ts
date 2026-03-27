// Pinterest API v5 response types

export interface PinterestPin {
  id: string;
  media?: {
    images?: {
      "600x"?: { url: string };
      originals?: { url: string };
    };
  };
  description?: string;
  link?: string;
  title?: string;
}

export interface PinterestBoard {
  id: string;
  name: string;
  media?: {
    image_cover_url?: string;
  };
  pin_count?: number;
  description?: string;
}

// Helper to extract image URL from Pinterest pin
export const getPinImageUrl = (pin: PinterestPin): string => {
  return (
    pin.media?.images?.["600x"]?.url ||
    pin.media?.images?.originals?.url ||
    "/placeholder.svg"
  );
};

// Helper to extract cover image from board
export const getBoardCoverUrl = (board: PinterestBoard): string => {
  return board.media?.image_cover_url || "/placeholder.svg";
};

// Extract search keywords from pin description
export const extractKeywords = (description?: string): string => {
  if (!description) return "fashion";
  return description.split(/\s+/).slice(0, 3).join(" ");
};
