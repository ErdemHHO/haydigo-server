import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@haydigo/common';
import { USER_LIMITS } from '@haydigo/contracts';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: USER_LIMITS.emailMaxLength, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', select: false })
  passwordHash: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: USER_LIMITS.fullNameMaxLength,
  })
  fullName: string;
}
