export interface City {
  name: string;
  pincodes: string[];
}

export interface State {
  name: string;
  cities: City[];
}

export const indianStates: State[] = [
  {
    name: "Andhra Pradesh",
    cities: [
      { name: "Visakhapatnam", pincodes: ["530001", "530002", "530003"] },
      { name: "Vijayawada", pincodes: ["520001", "520002", "520003"] },
      { name: "Guntur", pincodes: ["522001", "522002"] },
      { name: "Tirupati", pincodes: ["517501", "517502"] },
    ],
  },
  {
    name: "Arunachal Pradesh",
    cities: [
      { name: "Itanagar", pincodes: ["791111", "791112"] },
      { name: "Naharlagun", pincodes: ["791110"] },
    ],
  },
  {
    name: "Assam",
    cities: [
      { name: "Guwahati", pincodes: ["781001", "781002", "781003"] },
      { name: "Dibrugarh", pincodes: ["786001", "786002"] },
      { name: "Silchar", pincodes: ["788001", "788002"] },
    ],
  },
  {
    name: "Bihar",
    cities: [
      { name: "Patna", pincodes: ["800001", "800002", "800003"] },
      { name: "Gaya", pincodes: ["823001", "823002"] },
      { name: "Muzaffarpur", pincodes: ["842001", "842002"] },
    ],
  },
  {
    name: "Chhattisgarh",
    cities: [
      { name: "Raipur", pincodes: ["492001", "492002", "492003"] },
      { name: "Bhilai", pincodes: ["490001", "490002"] },
      { name: "Bilaspur", pincodes: ["495001", "495002"] },
    ],
  },
  {
    name: "Delhi",
    cities: [
      { name: "New Delhi", pincodes: ["110001", "110002", "110003", "110004", "110005"] },
      { name: "South Delhi", pincodes: ["110017", "110019", "110020", "110024", "110025"] },
      { name: "North Delhi", pincodes: ["110006", "110007", "110009", "110033", "110035"] },
      { name: "East Delhi", pincodes: ["110031", "110032", "110051", "110091", "110092"] },
      { name: "West Delhi", pincodes: ["110015", "110018", "110027", "110041", "110058"] },
    ],
  },
  {
    name: "Goa",
    cities: [
      { name: "Panaji", pincodes: ["403001", "403002"] },
      { name: "Margao", pincodes: ["403601", "403602"] },
      { name: "Vasco da Gama", pincodes: ["403802", "403803"] },
    ],
  },
  {
    name: "Gujarat",
    cities: [
      { name: "Ahmedabad", pincodes: ["380001", "380002", "380003", "380004", "380005"] },
      { name: "Surat", pincodes: ["395001", "395002", "395003"] },
      { name: "Vadodara", pincodes: ["390001", "390002", "390003"] },
      { name: "Rajkot", pincodes: ["360001", "360002", "360003"] },
    ],
  },
  {
    name: "Haryana",
    cities: [
      { name: "Gurugram", pincodes: ["122001", "122002", "122003", "122004"] },
      { name: "Faridabad", pincodes: ["121001", "121002", "121003"] },
      { name: "Chandigarh", pincodes: ["160001", "160002"] },
      { name: "Panipat", pincodes: ["132001", "132002"] },
    ],
  },
  {
    name: "Himachal Pradesh",
    cities: [
      { name: "Shimla", pincodes: ["171001", "171002", "171003"] },
      { name: "Dharamshala", pincodes: ["176215", "176216"] },
      { name: "Manali", pincodes: ["175131"] },
    ],
  },
  {
    name: "Jharkhand",
    cities: [
      { name: "Ranchi", pincodes: ["834001", "834002", "834003"] },
      { name: "Jamshedpur", pincodes: ["831001", "831002", "831003"] },
      { name: "Dhanbad", pincodes: ["826001", "826002"] },
    ],
  },
  {
    name: "Karnataka",
    cities: [
      { name: "Bangalore", pincodes: ["560001", "560002", "560003", "560004", "560005"] },
      { name: "Mysore", pincodes: ["570001", "570002", "570003"] },
      { name: "Mangalore", pincodes: ["575001", "575002", "575003"] },
      { name: "Hubli", pincodes: ["580001", "580002"] },
    ],
  },
  {
    name: "Kerala",
    cities: [
      { name: "Kochi", pincodes: ["682001", "682002", "682003", "682004"] },
      { name: "Thiruvananthapuram", pincodes: ["695001", "695002", "695003"] },
      { name: "Kozhikode", pincodes: ["673001", "673002", "673003"] },
      { name: "Thrissur", pincodes: ["680001", "680002"] },
    ],
  },
  {
    name: "Madhya Pradesh",
    cities: [
      { name: "Bhopal", pincodes: ["462001", "462002", "462003"] },
      { name: "Indore", pincodes: ["452001", "452002", "452003"] },
      { name: "Jabalpur", pincodes: ["482001", "482002"] },
      { name: "Gwalior", pincodes: ["474001", "474002"] },
    ],
  },
  {
    name: "Maharashtra",
    cities: [
      { name: "Mumbai", pincodes: ["400001", "400002", "400003", "400004", "400005"] },
      { name: "Pune", pincodes: ["411001", "411002", "411003", "411004", "411005"] },
      { name: "Nagpur", pincodes: ["440001", "440002", "440003"] },
      { name: "Thane", pincodes: ["400601", "400602", "400603"] },
      { name: "Nashik", pincodes: ["422001", "422002", "422003"] },
    ],
  },
  {
    name: "Manipur",
    cities: [
      { name: "Imphal", pincodes: ["795001", "795002"] },
      { name: "Thoubal", pincodes: ["795138"] },
    ],
  },
  {
    name: "Meghalaya",
    cities: [
      { name: "Shillong", pincodes: ["793001", "793002", "793003"] },
      { name: "Tura", pincodes: ["794001"] },
    ],
  },
  {
    name: "Mizoram",
    cities: [
      { name: "Aizawl", pincodes: ["796001", "796002"] },
      { name: "Lunglei", pincodes: ["796701"] },
    ],
  },
  {
    name: "Nagaland",
    cities: [
      { name: "Kohima", pincodes: ["797001", "797002"] },
      { name: "Dimapur", pincodes: ["797112", "797113"] },
    ],
  },
  {
    name: "Odisha",
    cities: [
      { name: "Bhubaneswar", pincodes: ["751001", "751002", "751003"] },
      { name: "Cuttack", pincodes: ["753001", "753002", "753003"] },
      { name: "Rourkela", pincodes: ["769001", "769002"] },
    ],
  },
  {
    name: "Punjab",
    cities: [
      { name: "Chandigarh", pincodes: ["160001", "160002", "160003"] },
      { name: "Ludhiana", pincodes: ["141001", "141002", "141003"] },
      { name: "Amritsar", pincodes: ["143001", "143002", "143003"] },
      { name: "Jalandhar", pincodes: ["144001", "144002"] },
    ],
  },
  {
    name: "Rajasthan",
    cities: [
      { name: "Jaipur", pincodes: ["302001", "302002", "302003", "302004", "302005"] },
      { name: "Jodhpur", pincodes: ["342001", "342002", "342003"] },
      { name: "Udaipur", pincodes: ["313001", "313002", "313003"] },
      { name: "Kota", pincodes: ["324001", "324002"] },
    ],
  },
  {
    name: "Sikkim",
    cities: [
      { name: "Gangtok", pincodes: ["737101", "737102"] },
      { name: "Namchi", pincodes: ["737126"] },
    ],
  },
  {
    name: "Tamil Nadu",
    cities: [
      { name: "Chennai", pincodes: ["600001", "600002", "600003", "600004", "600005"] },
      { name: "Coimbatore", pincodes: ["641001", "641002", "641003"] },
      { name: "Madurai", pincodes: ["625001", "625002", "625003"] },
      { name: "Tiruchirappalli", pincodes: ["620001", "620002"] },
    ],
  },
  {
    name: "Telangana",
    cities: [
      { name: "Hyderabad", pincodes: ["500001", "500002", "500003", "500004", "500005"] },
      { name: "Warangal", pincodes: ["506001", "506002"] },
      { name: "Nizamabad", pincodes: ["503001", "503002"] },
    ],
  },
  {
    name: "Tripura",
    cities: [
      { name: "Agartala", pincodes: ["799001", "799002"] },
      { name: "Udaipur", pincodes: ["799120"] },
    ],
  },
  {
    name: "Uttar Pradesh",
    cities: [
      { name: "Lucknow", pincodes: ["226001", "226002", "226003", "226004"] },
      { name: "Noida", pincodes: ["201301", "201302", "201303", "201304"] },
      { name: "Ghaziabad", pincodes: ["201001", "201002", "201003"] },
      { name: "Kanpur", pincodes: ["208001", "208002", "208003"] },
      { name: "Varanasi", pincodes: ["221001", "221002", "221003"] },
      { name: "Agra", pincodes: ["282001", "282002", "282003"] },
    ],
  },
  {
    name: "Uttarakhand",
    cities: [
      { name: "Dehradun", pincodes: ["248001", "248002", "248003"] },
      { name: "Haridwar", pincodes: ["249401", "249402"] },
      { name: "Nainital", pincodes: ["263001", "263002"] },
    ],
  },
  {
    name: "West Bengal",
    cities: [
      { name: "Kolkata", pincodes: ["700001", "700002", "700003", "700004", "700005"] },
      { name: "Howrah", pincodes: ["711101", "711102", "711103"] },
      { name: "Durgapur", pincodes: ["713201", "713202"] },
      { name: "Siliguri", pincodes: ["734001", "734002"] },
    ],
  },
];

export const getStates = (): string[] => {
  return indianStates.map((state) => state.name);
};

export const getCitiesByState = (stateName: string): string[] => {
  const state = indianStates.find((s) => s.name === stateName);
  return state ? state.cities.map((city) => city.name) : [];
};

export const getPincodesByCity = (stateName: string, cityName: string): string[] => {
  const state = indianStates.find((s) => s.name === stateName);
  if (!state) return [];
  const city = state.cities.find((c) => c.name === cityName);
  return city ? city.pincodes : [];
};
