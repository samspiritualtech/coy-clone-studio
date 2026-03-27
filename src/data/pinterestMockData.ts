export interface PinterestPin {
  id: string;
  image: string;
  description: string;
  link: string;
  searchKeyword: string;
}

export interface PinterestBoard {
  id: string;
  name: string;
  coverImage: string;
  pinCount: number;
  pins: PinterestPin[];
}

export const mockPinterestBoards: PinterestBoard[] = [
  {
    id: "board-1",
    name: "Summer Dresses",
    coverImage: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
    pinCount: 24,
    pins: [
      { id: "p1-1", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", description: "Floral summer dress", link: "#", searchKeyword: "floral dress" },
      { id: "p1-2", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80", description: "White cotton sundress", link: "#", searchKeyword: "white dress" },
      { id: "p1-3", image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&q=80", description: "Pastel maxi dress", link: "#", searchKeyword: "maxi dress" },
      { id: "p1-4", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", description: "Boho beach dress", link: "#", searchKeyword: "boho dress" },
      { id: "p1-5", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80", description: "Linen wrap dress", link: "#", searchKeyword: "wrap dress" },
    ],
  },
  {
    id: "board-2",
    name: "Ethnic Wear Inspo",
    coverImage: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80",
    pinCount: 18,
    pins: [
      { id: "p2-1", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80", description: "Embroidered kurta set", link: "#", searchKeyword: "kurta" },
      { id: "p2-2", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80", description: "Silk saree drape", link: "#", searchKeyword: "saree" },
      { id: "p2-3", image: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&q=80", description: "Anarkali suit", link: "#", searchKeyword: "anarkali" },
      { id: "p2-4", image: "https://images.unsplash.com/photo-1614886137426-55a47e4b9cf7?w=400&q=80", description: "Lehenga choli", link: "#", searchKeyword: "lehenga" },
    ],
  },
  {
    id: "board-3",
    name: "Street Style",
    coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    pinCount: 31,
    pins: [
      { id: "p3-1", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80", description: "Oversized blazer look", link: "#", searchKeyword: "blazer" },
      { id: "p3-2", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80", description: "Denim on denim", link: "#", searchKeyword: "denim" },
      { id: "p3-3", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80", description: "Cargo pants styling", link: "#", searchKeyword: "cargo pants" },
      { id: "p3-4", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80", description: "Streetwear layering", link: "#", searchKeyword: "streetwear" },
      { id: "p3-5", image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&q=80", description: "Graphic tee outfit", link: "#", searchKeyword: "graphic tee" },
      { id: "p3-6", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", description: "Minimalist street look", link: "#", searchKeyword: "minimalist outfit" },
    ],
  },
  {
    id: "board-4",
    name: "Wedding Guest",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
    pinCount: 15,
    pins: [
      { id: "p4-1", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80", description: "Pastel gown", link: "#", searchKeyword: "gown" },
      { id: "p4-2", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80", description: "Cocktail dress", link: "#", searchKeyword: "cocktail dress" },
      { id: "p4-3", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80", description: "Sequin party wear", link: "#", searchKeyword: "sequin dress" },
      { id: "p4-4", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80", description: "Classic evening look", link: "#", searchKeyword: "evening dress" },
    ],
  },
  {
    id: "board-5",
    name: "Accessories Edit",
    coverImage: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80",
    pinCount: 22,
    pins: [
      { id: "p5-1", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80", description: "Gold statement earrings", link: "#", searchKeyword: "earrings" },
      { id: "p5-2", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80", description: "Designer handbag", link: "#", searchKeyword: "handbag" },
      { id: "p5-3", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80", description: "Sneakers styling", link: "#", searchKeyword: "sneakers" },
      { id: "p5-4", image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&q=80", description: "Layered necklaces", link: "#", searchKeyword: "necklace" },
    ],
  },
  {
    id: "board-6",
    name: "Work Wardrobe",
    coverImage: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80",
    pinCount: 19,
    pins: [
      { id: "p6-1", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80", description: "Tailored trouser suit", link: "#", searchKeyword: "trouser suit" },
      { id: "p6-2", image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&q=80", description: "Power blazer outfit", link: "#", searchKeyword: "blazer" },
      { id: "p6-3", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", description: "Pencil skirt styling", link: "#", searchKeyword: "pencil skirt" },
      { id: "p6-4", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", description: "Office tote bag", link: "#", searchKeyword: "tote bag" },
      { id: "p6-5", image: "https://images.unsplash.com/photo-1475180429745-fcddc61f1907?w=400&q=80", description: "Smart casual look", link: "#", searchKeyword: "smart casual" },
    ],
  },
];
