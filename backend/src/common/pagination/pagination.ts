import { PaginationDto } from './pagination.dto';
export const pagination = (query: PaginationDto) => ({ skip: (query.page - 1) * query.limit, take: query.limit });
export const pageResult = <T>(items: T[], total: number, query: PaginationDto) => ({ items, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
