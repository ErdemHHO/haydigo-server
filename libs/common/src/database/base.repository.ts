import type {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import type { AbstractEntity } from './abstract.entity';

export abstract class BaseRepository<TEntity extends AbstractEntity> {
  protected constructor(protected readonly repository: Repository<TEntity>) {}

  findById(id: string): Promise<TEntity | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<TEntity>);
  }

  findOneWhere(where: FindOptionsWhere<TEntity>): Promise<TEntity | null> {
    return this.repository.findOneBy(where);
  }

  findManyWhere(
    where: FindOptionsWhere<TEntity>,
    order?: FindOptionsOrder<TEntity>,
  ): Promise<TEntity[]> {
    return this.repository.find({ where, order });
  }

  existsWhere(where: FindOptionsWhere<TEntity>): Promise<boolean> {
    return this.repository.existsBy(where);
  }

  create(data: DeepPartial<TEntity>): Promise<TEntity> {
    return this.repository.save(this.repository.create(data));
  }

  save(entity: TEntity): Promise<TEntity> {
    return this.repository.save(entity);
  }
}
