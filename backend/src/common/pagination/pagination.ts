import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export const paginate = async <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number = 1,
  limit: number = 35,
): Promise<{ items: T[]; total: number; page: number; limit: number }> => {
  const [items, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    items,
    total,
    page,
    limit,
  };
};
