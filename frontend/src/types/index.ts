export interface Sweet {
  _id: string; // MongoDB uses _id
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}