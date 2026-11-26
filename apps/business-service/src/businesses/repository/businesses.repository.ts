import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@haydigo/common';
import { BusinessStatus } from '@haydigo/contracts';
import { Business } from '../entity/business.entity';
import type {
  CreateBusinessData,
  PublishedBusinessesFilter,
} from '../interfaces/business-data.interface';

@Injectable()
export class BusinessesRepository extends BaseRepository<Business> {
  constructor(@InjectRepository(Business) repository: Repository<Business>) {
    super(repository);
  }

  createDraft(data: CreateBusinessData): Promise<Business> {
    return this.create({ ...data, status: BusinessStatus.Draft });
  }

  findPublishedById(id: string): Promise<Business | null> {
    return this.findOneWhere({ id, status: BusinessStatus.Published });
  }

  findPublishedPage(
    filter: PublishedBusinessesFilter,
  ): Promise<[Business[], number]> {
    return this.repository.findAndCount({
      where: {
        status: BusinessStatus.Published,
        ...(filter.city && { city: filter.city }),
        ...(filter.category && { category: filter.category }),
      },
      order: { publishedAt: 'DESC' },
      skip: filter.skip,
      take: filter.take,
    });
  }

  findByOwner(ownerUserId: string): Promise<Business[]> {
    return this.findManyWhere({ ownerUserId }, { createdAt: 'DESC' });
  }

  markPublished(business: Business, publishedAt: Date): Promise<Business> {
    business.status = BusinessStatus.Published;
    business.publishedAt = publishedAt;
    return this.save(business);
  }
}
