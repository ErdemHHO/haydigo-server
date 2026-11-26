import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BUSINESS_PATTERNS } from '@haydigo/contracts';
import type {
  BusinessDto,
  CreateBusinessPayload,
  FindBusinessByIdPayload,
  ListBusinessesByOwnerPayload,
  ListPublishedBusinessesPayload,
  Paginated,
  PublishBusinessPayload,
} from '@haydigo/contracts';
import { BusinessesService } from './businesses.service';

@Controller()
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @MessagePattern(BUSINESS_PATTERNS.create)
  create(@Payload() payload: CreateBusinessPayload): Promise<BusinessDto> {
    return this.businessesService.create(payload);
  }

  @MessagePattern(BUSINESS_PATTERNS.listPublished)
  listPublished(
    @Payload() payload: ListPublishedBusinessesPayload,
  ): Promise<Paginated<BusinessDto>> {
    return this.businessesService.listPublished(payload);
  }

  @MessagePattern(BUSINESS_PATTERNS.findPublishedById)
  findPublishedById(
    @Payload() payload: FindBusinessByIdPayload,
  ): Promise<BusinessDto> {
    return this.businessesService.findPublishedById(payload.id);
  }

  @MessagePattern(BUSINESS_PATTERNS.listByOwner)
  listByOwner(
    @Payload() payload: ListBusinessesByOwnerPayload,
  ): Promise<BusinessDto[]> {
    return this.businessesService.listByOwner(payload.ownerUserId);
  }

  @MessagePattern(BUSINESS_PATTERNS.publish)
  publish(@Payload() payload: PublishBusinessPayload): Promise<BusinessDto> {
    return this.businessesService.publish(payload);
  }
}
