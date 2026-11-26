import type { Repository } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { BaseRepository } from './base.repository';

class Thing extends AbstractEntity {
  name: string;
}

class ThingsRepository extends BaseRepository<Thing> {
  constructor(repository: Repository<Thing>) {
    super(repository);
  }
}

describe('BaseRepository', () => {
  const thing = Object.assign(new Thing(), { id: 'thing-1', name: 'Kahve' });
  let typeorm: jest.Mocked<
    Pick<
      Repository<Thing>,
      'findOneBy' | 'find' | 'existsBy' | 'create' | 'save'
    >
  >;
  let repository: ThingsRepository;

  beforeEach(() => {
    typeorm = {
      findOneBy: jest.fn().mockResolvedValue(thing),
      find: jest.fn().mockResolvedValue([thing]),
      existsBy: jest.fn().mockResolvedValue(true),
      create: jest.fn((data) => Object.assign(new Thing(), data)),
      save: jest.fn(async (entity) => entity as Thing),
    } as never;
    repository = new ThingsRepository(typeorm as unknown as Repository<Thing>);
  });

  it('finds by id', async () => {
    await expect(repository.findById('thing-1')).resolves.toBe(thing);
    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: 'thing-1' });
  });

  it('finds many with an order', async () => {
    await repository.findManyWhere({ name: 'Kahve' }, { createdAt: 'DESC' });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { name: 'Kahve' },
      order: { createdAt: 'DESC' },
    });
  });

  it('creates an entity from the data and saves it', async () => {
    const created = await repository.create({ name: 'Çay' });

    expect(created).toBeInstanceOf(Thing);
    expect(typeorm.save).toHaveBeenCalledWith(created);
  });
});
