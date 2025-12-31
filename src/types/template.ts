export interface Template {
  id: string;
  name: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplatePayload {
  name: string;
  title: string;
  content: string;
  category?: string;
}
