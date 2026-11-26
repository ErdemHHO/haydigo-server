import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessStatus } from '@haydigo/contracts';
import type {
  BusinessDto,
  CreateBusinessPayload,
  ListPublishedBusinessesPayload,
  Paginated,
  PublishBusinessPayload,
} from '@haydigo/contracts';
import { BUSINESS_MESSAGES } from './constants/businesses.constants';
import type { Business } from './entity/business.entity';
import { BusinessesRepository } from './repository/businesses.repository';
import { toBusinessDto } from './utils/business.mapper';

@Injectable()
export class BusinessesService {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async create(payload: CreateBusinessPayload): Promise<BusinessDto> {
    const business = await this.businessesRepository.createDraft({
      ownerUserId: payload.ownerUserId,
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      category: payload.category.trim(),
      city: payload.city.trim(),
    });
    return toBusinessDto(business);
  }

  async listPublished(
    payload: ListPublishedBusinessesPayload,
  ): Promise<Paginated<BusinessDto>> {
    const [items, total] = await this.businessesRepository.findPublishedPage({
      city: payload.city,
      category: payload.category,
      skip: (payload.page - 1) * payload.limit,
      take: payload.limit,
    });
    return {
      items: items.map(toBusinessDto),
      total,
      page: payload.page,
      limit: payload.limit,
    };
  }

  async findPublishedById(id: string): Promise<BusinessDto> {
    const business = await this.businessesRepository.findPublishedById(id);
    if (!business) {
      throw new NotFoundException(BUSINESS_MESSAGES.notFound);
    }
    return toBusinessDto(business);
  }

  async listByOwner(ownerUserId: string): Promise<BusinessDto[]> {
    const businesses = await this.businessesRepository.findByOwner(ownerUserId);
    return businesses.map(toBusinessDto);
  }

  async publish(payload: PublishBusinessPayload): Promise<BusinessDto> {
    const business = await this.findOwnedBusiness(
      payload.id,
      payload.requesterUserId,
    );
    if (business.status === BusinessStatus.Published) {
      return toBusinessDto(business);
    }
    return toBusinessDto(
      await this.businessesRepository.markPublished(business, new Date()),
    );
  }

  private async findOwnedBusiness(
    id: string,
    userId: string,
  ): Promise<Business> {
    const business = await this.businessesRepository.findById(id);
    if (!business || business.ownerUserId !== userId) {
      throw new NotFoundException(BUSINESS_MESSAGES.notFound);
    }
    return business;
  }
}
