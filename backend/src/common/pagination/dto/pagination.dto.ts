export class PaginationDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
