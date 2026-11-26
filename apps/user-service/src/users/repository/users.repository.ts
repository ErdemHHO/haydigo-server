import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@haydigo/common';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.existsWhere({ email });
  }

  findByEmailWithPasswordHash(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }
}
