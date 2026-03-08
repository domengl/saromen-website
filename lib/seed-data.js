export const seedProducts = [
  {
    slug: "noir-amber",
    name: "Noir Amber",
    category: "Disavne",
    scent: "Amber + Vanilla",
    description: "Topel vecerni vonj z bogatim premium podpisom.",
    price: 34,
    stock: 18,
    etaDays: 5,
    isTop: true,
    isNew: false,
    salePercent: 0
  },
  {
    slug: "velvet-fig",
    name: "Velvet Fig",
    category: "Disavne",
    scent: "Fig + Sandalwood",
    description: "Sodoben sadni profil za eleganten ritual doma.",
    price: 32,
    stock: 8,
    etaDays: 4,
    isTop: true,
    isNew: false,
    salePercent: 10
  },
  {
    slug: "golden-musk",
    name: "Golden Musk",
    category: "Premium Reserve",
    scent: "Musk + Cedar",
    description: "Globok, umirjen in prefinjen vonj.",
    price: 39,
    stock: 0,
    etaDays: 7,
    isTop: true,
    isNew: false,
    salePercent: 0
  },
  {
    slug: "cashmere-bloom",
    name: "Cashmere Bloom",
    category: "Novosti",
    scent: "White Tea + Floral",
    description: "Nezen clean-luxe obcutek za dnevni ambient.",
    price: 31,
    stock: 14,
    etaDays: 4,
    isTop: false,
    isNew: true,
    salePercent: 0
  },
  {
    slug: "runway-smoke",
    name: "Runway Smoke",
    category: "Modni Dodatek",
    scent: "Smoked Oud",
    description: "Editorial statement sveca za dizajnerski dom.",
    price: 43,
    stock: 4,
    etaDays: 6,
    isTop: false,
    isNew: false,
    salePercent: 15
  }
];

export const seedCoupons = [
  { code: "SARA10", percent: 10, minAmount: 0 },
  { code: "DOMEN15", percent: 15, minAmount: 60 },
  { code: "LOVE20", percent: 20, minAmount: 120 }
];
