import type { BusinessDto } from '@haydigo/contracts';
import type { Business } from '../entity/business.entity';

export function toBusinessDto(business: Business): BusinessDto {
  return {
    id: business.id,
    ownerUserId: business.ownerUserId,
    name: business.name,
    description: business.description,
    category: business.category,
    city: business.city,
    status: business.status,
    publishedAt: business.publishedAt?.toISOString() ?? null,
    createdAt: business.createdAt.toISOString(),
  };
}
