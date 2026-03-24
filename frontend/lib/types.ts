export interface Link {
  id: number;
  userId: number;
  linkCode: string;
  productName: string;
  productDescription: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
