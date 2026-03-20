export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Burgers" | "Pizza" | "Pasta" | "Beverages" | "Desserts" | "Wraps" | "Mains" | "Salads";
  image: string;
  rating: number;
}
