export interface Chili {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  characteristics?: string;
  uses?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChiliPayload {
  name: string;
  description: string;
  imageUrl?: string;
  characteristics?: string;
  uses?: string;
}
