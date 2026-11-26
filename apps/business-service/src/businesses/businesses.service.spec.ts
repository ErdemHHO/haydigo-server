import { NotFoundException } from '@nestjs/common';
import { BusinessStatus } from '@haydigo/contracts';
import { BusinessesService } from './businesses.service';
import { BUSINESS_MESSAGES } from './constants/businesses.constants';
import { Business } from './entity/business.entity';
import type { CreateBusinessData } from './interfaces/business-data.interface';
import type { BusinessesRepository } from './repository/businesses.repository';

const BUSINESS_ID = '0d6f3c0a-3f4e-4b8a-8f0e-1c2d3e4f5a6b';
const OWNER_ID = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
const OTHER_USER_ID = '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b';

function makeBusiness(overrides: Partial<Business> = {}): Business {
  return Object.assign(new Business(), {
    id: BUSINESS_ID,
    ownerUserId: OWNER_ID,
    name: 'Kahve Durağı',
    description: null,
    category: 'cafe',
    city: 'Istanbul',
    status: BusinessStatus.Draft,
    publishedAt: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  });
}

describe('BusinessesService', () => {
  let repository: jest.Mocked<BusinessesRepository>;
  let service: BusinessesService;

  beforeEach(() => {
    repository = {
      createDraft: jest.fn(async (data: CreateBusinessData) =>
        makeBusiness(data),
      ),
      findById: jest.fn(),
      findPublishedById: jest.fn(),
      findPublishedPage: jest.fn().mockResolvedValue([[], 0]),
      findByOwner: jest.fn(),
      markPublished: jest.fn(async (business: Business, publishedAt: Date) =>
        Object.assign(business, {
          status: BusinessStatus.Published,
          publishedAt,
        }),
      ),
    } as unknown as jest.Mocked<BusinessesRepository>;
    service = new BusinessesService(repository);
  });

  it('trims input and stores an empty description as null', async () => {
    await service.create({
      ownerUserId: OWNER_ID,
      name: ' Kahve Durağı ',
      description: '   ',
      category: 'cafe',
      city: ' Istanbul ',
    });

    expect(repository.createDraft).toHaveBeenCalledWith({
      ownerUserId: OWNER_ID,
      name: 'Kahve Durağı',
      description: null,
      category: 'cafe',
      city: 'Istanbul',
    });
  });

  it('turns page and limit into skip and take', async () => {
    await service.listPublished({ city: 'Istanbul', page: 3, limit: 10 });

    expect(repository.findPublishedPage).toHaveBeenCalledWith({
      city: 'Istanbul',
      category: undefined,
      skip: 20,
      take: 10,
    });
  });

  describe('publish', () => {
    it('publishes the owner’s draft', async () => {
      repository.findById.mockResolvedValue(makeBusiness());

      const business = await service.publish({
        id: BUSINESS_ID,
        requesterUserId: OWNER_ID,
      });

      expect(business.status).toBe(BusinessStatus.Published);
      expect(repository.markPublished).toHaveBeenCalledTimes(1);
    });

    it('answers not found to someone who is not the owner', async () => {
      repository.findById.mockResolvedValue(makeBusiness());

      await expect(
        service.publish({ id: BUSINESS_ID, requesterUserId: OTHER_USER_ID }),
      ).rejects.toThrow(new NotFoundException(BUSINESS_MESSAGES.notFound));
      expect(repository.markPublished).not.toHaveBeenCalled();
    });

    it('keeps the first publish date when published again', async () => {
      const publishedAt = new Date('2026-02-01T00:00:00Z');
      repository.findById.mockResolvedValue(
        makeBusiness({ status: BusinessStatus.Published, publishedAt }),
      );

      const business = await service.publish({
        id: BUSINESS_ID,
        requesterUserId: OWNER_ID,
      });

      expect(business.publishedAt).toBe(publishedAt.toISOString());
      expect(repository.markPublished).not.toHaveBeenCalled();
    });
  });

  it('answers not found for a draft in the public lookup', async () => {
    repository.findPublishedById.mockResolvedValue(null);

    await expect(service.findPublishedById(BUSINESS_ID)).rejects.toThrow(
      new NotFoundException(BUSINESS_MESSAGES.notFound),
    );
  });
});
