import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { BUSINESS_PATTERNS, BUSINESS_SERVICE } from '@haydigo/contracts';
import type {
  BusinessDto,
  CreateBusinessPayload,
  FindBusinessByIdPayload,
  ListBusinessesByOwnerPayload,
  ListPublishedBusinessesPayload,
  Paginated,
  PublishBusinessPayload,
} from '@haydigo/contracts';
import { sendRpc } from '../common/messaging/send-rpc';
import type { CreateBusinessDto } from './dto/create-business.dto';
import type { ListBusinessesQueryDto } from './dto/list-businesses-query.dto';

@Injectable()
export class BusinessesService {
  constructor(@Inject(BUSINESS_SERVICE) private readonly client: ClientProxy) {}

  listPublished(
    query: ListBusinessesQueryDto,
  ): Promise<Paginated<BusinessDto>> {
    return sendRpc<Paginated<BusinessDto>, ListPublishedBusinessesPayload>(
      this.client,
      BUSINESS_PATTERNS.listPublished,
      {
        city: query.city,
        category: query.category,
        page: query.page,
        limit: query.limit,
      },
    );
  }

  findPublishedById(id: string): Promise<BusinessDto> {
    return sendRpc<BusinessDto, FindBusinessByIdPayload>(
      this.client,
      BUSINESS_PATTERNS.findPublishedById,
      { id },
    );
  }

  create(ownerUserId: string, dto: CreateBusinessDto): Promise<BusinessDto> {
    return sendRpc<BusinessDto, CreateBusinessPayload>(
      this.client,
      BUSINESS_PATTERNS.create,
      {
        ownerUserId,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        city: dto.city,
      },
    );
  }

  publish(id: string, userId: string): Promise<BusinessDto> {
    return sendRpc<BusinessDto, PublishBusinessPayload>(
      this.client,
      BUSINESS_PATTERNS.publish,
      { id, requesterUserId: userId },
    );
  }

  listByOwner(ownerUserId: string): Promise<BusinessDto[]> {
    return sendRpc<BusinessDto[], ListBusinessesByOwnerPayload>(
      this.client,
      BUSINESS_PATTERNS.listByOwner,
      { ownerUserId },
    );
  }
}
