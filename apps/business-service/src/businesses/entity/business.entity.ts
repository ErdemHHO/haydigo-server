import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '@haydigo/common';
import { BUSINESS_LIMITS, BusinessStatus } from '@haydigo/contracts';

@Entity({ name: 'businesses' })
@Index(['status', 'city', 'category'])
export class Business extends AbstractEntity {
  @Index()
  @Column({ name: 'owner_user_id', type: 'uuid' })
  ownerUserId: string;

  @Column({ type: 'varchar', length: BUSINESS_LIMITS.nameMaxLength })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: BUSINESS_LIMITS.categoryMaxLength })
  category: string;

  @Column({ type: 'varchar', length: BUSINESS_LIMITS.cityMaxLength })
  city: string;

  @Column({
    type: 'enum',
    enum: BusinessStatus,
    enumName: 'business_status',
    default: BusinessStatus.Draft,
  })
  status: BusinessStatus;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date | null;
}
