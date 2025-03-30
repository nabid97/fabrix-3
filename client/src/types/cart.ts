// src/types/cart.ts
export interface CartItem {
  id: string;
  type: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  options: {
    color?: string;
    size?: string;
    fabric?: string; // Add this line to include fabric
  };
}

export interface CartState {
  items: CartItem[];
  total: number;
}