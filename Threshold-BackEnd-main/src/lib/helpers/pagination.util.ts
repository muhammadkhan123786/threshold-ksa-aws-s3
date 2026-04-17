import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { PaginationQueryDto } from "src/dto/paginationQuery/pagination-query.dto";

export function toPaginationOptions(
    query: PaginationQueryDto
): IPaginationOptions {
    return {
        page: query.page || 1,
        limit: query.limit || 10,
        route: query.route || "",
    };
}
