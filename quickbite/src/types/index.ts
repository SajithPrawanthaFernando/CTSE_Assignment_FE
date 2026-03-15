export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Burgers" | "Pizza" | "Pasta" | "Beverages" | "Desserts";
  image: string;
  rating: number;
}
