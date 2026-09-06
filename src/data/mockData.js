export const categories = [
  { id: "electronics", name: "Electronics", count: 42, icon: "Laptop", sales: "₹45,200" },
  { id: "clothing", name: "Clothing & Apparel", count: 38, icon: "Shirt", sales: "₹28,400" },
  { id: "home", name: "Home & Living", count: 29, icon: "Home", sales: "₹19,800" },
  { id: "beauty", name: "Beauty & Personal Care", count: 24, icon: "Sparkles", sales: "₹14,500" },
  { id: "sports", name: "Sports & Fitness", count: 18, icon: "Dumbbell", sales: "₹12,100" }
];

export const initialProducts = [
  {
    id: 1,
    title: "Wireless Noise-Canceling Headphones",
    category: "electronics",
    price: 2499.00,
    oldPrice: 2999.00,
    rating: 4.8,
    reviews: 128,
    stock: 45,
    status: "in-stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio fidelity."
  },
  {
    id: 2,
    title: "Minimalist Leather Smartwatch",
    category: "electronics",
    price: 1895.00,
    oldPrice: 2190.00,
    rating: 4.6,
    reviews: 95,
    stock: 18,
    status: "low-stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Sleek smartwatch with heart rate monitoring, sleep tracking, custom watch faces, and genuine leather strap."
  },
  {
    id: 3,
    title: "Ergonomic Mechanical Keyboard",
    category: "electronics",
    price: 1290.00,
    rating: 4.9,
    reviews: 210,
    stock: 60,
    status: "in-stock",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    description: "Hot-swappable RGB mechanical keyboard featuring custom tactile switches and programmable macro keys."
  }
];
