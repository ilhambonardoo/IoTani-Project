export interface Content {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentPayload {
  title: string;
  category: string;
  content: string;
  role?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}
