export interface CreateBusinessData {
  ownerUserId: string;
  name: string;
  description: string | null;
  category: string;
  city: string;
}

export interface PublishedBusinessesFilter {
  city?: string;
  category?: string;
  skip: number;
  take: number;
}
