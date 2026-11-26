export const BUSINESS_PATTERNS = {
  create: 'business.create',
  listPublished: 'business.list-published',
  findPublishedById: 'business.find-published-by-id',
  listByOwner: 'business.list-by-owner',
  publish: 'business.publish',
} as const;

export enum BusinessStatus {
  Draft = 'draft',
  Published = 'published',
}

export const BUSINESS_LIMITS = {
  nameMinLength: 2,
  nameMaxLength: 160,
  descriptionMaxLength: 2000,
  categoryMinLength: 2,
  categoryMaxLength: 80,
  cityMinLength: 2,
  cityMaxLength: 80,
} as const;

export interface CreateBusinessPayload {
  ownerUserId: string;
  name: string;
  description?: string;
  category: string;
  city: string;
}

export interface ListPublishedBusinessesPayload {
  city?: string;
  category?: string;
  page: number;
  limit: number;
}

export interface FindBusinessByIdPayload {
  id: string;
}

export interface ListBusinessesByOwnerPayload {
  ownerUserId: string;
}

export interface PublishBusinessPayload {
  id: string;
  requesterUserId: string;
}

export interface BusinessDto {
  id: string;
  ownerUserId: string;
  name: string;
  description: string | null;
  category: string;
  city: string;
  status: BusinessStatus;
  publishedAt: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
