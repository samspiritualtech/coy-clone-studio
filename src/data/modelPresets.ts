export interface ModelPreset {
  id: string;
  name: string;
  image: string;
  category: "upper_body" | "full_body" | "lower_body";
  gender: "female" | "male" | "unisex";
  usageCount: string;
  isNew: boolean;
  isFavorited?: boolean;
}

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "model-1",
    name: "Lena",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
    category: "full_body",
    gender: "female",
    usageCount: "16k",
    isNew: false,
  },
  {
    id: "model-2",
    name: "Hema",
    image: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400&h=600&fit=crop",
    category: "full_body",
    gender: "female",
    usageCount: "13k",
    isNew: true,
  },
  {
    id: "model-3",
    name: "Rani",
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=400&h=600&fit=crop",
    category: "upper_body",
    gender: "female",
    usageCount: "12k",
    isNew: false,
  },
  {
    id: "model-4",
    name: "Kevichusa",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
    category: "full_body",
    gender: "female",
    usageCount: "6.5k",
    isNew: true,
  },
  {
    id: "model-5",
    name: "Madhubala",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop",
    category: "upper_body",
    gender: "female",
    usageCount: "5.8k",
    isNew: true,
  },
  {
    id: "model-6",
    name: "Sheryl Luke",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    category: "full_body",
    gender: "female",
    usageCount: "5.4k",
    isNew: false,
  },
  {
    id: "model-7",
    name: "Kapoor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    category: "upper_body",
    gender: "male",
    usageCount: "4.8k",
    isNew: false,
  },
  {
    id: "model-8",
    name: "Naqini",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
    category: "full_body",
    gender: "female",
    usageCount: "4.1k",
    isNew: true,
  },
  {
    id: "model-9",
    name: "Devi",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop",
    category: "upper_body",
    gender: "female",
    usageCount: "3.7k",
    isNew: false,
  },
  {
    id: "model-10",
    name: "Alia-Bhatt",
    image: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=400&h=600&fit=crop",
    category: "full_body",
    gender: "female",
    usageCount: "3.7k",
    isNew: false,
  },
  {
    id: "model-11",
    name: "Marcus",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    category: "full_body",
    gender: "male",
    usageCount: "2.9k",
    isNew: true,
  },
  {
    id: "model-12",
    name: "Yuki",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    category: "upper_body",
    gender: "male",
    usageCount: "2.1k",
    isNew: false,
  },
];
