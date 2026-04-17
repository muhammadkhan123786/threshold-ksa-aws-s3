import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from "@nestjs/common";
import { camelCaseToSnakeCase } from "src/lib/helpers/stringHelpers";
import { GetQueryProps } from "src/types/getOperators";

@Injectable()
export class GetAllPipe implements PipeTransform<any> {
    constructor(
        FieldType: any,
        ascendants: string[],
        requestType?: "getAll" | "getOne"
    ) {
        this.FieldType = FieldType;
        this.ascendants = ascendants || [];
        this.requestType = requestType || "getAll";
    }

    FieldType: any = null;
    ascendants: string[] = [];
    requestType: "getAll" | "getOne" = "getAll";

    transform(query: GetQueryProps, metadata: ArgumentMetadata) {
        const {
            conditions,
            sortBy,
            reverse,
            page,
            capacity,
            descendants,
            whereQuery,
            ids,
            status,
            ...ascendants
        } = query;

        const finalQuery: any = {};

        if (this.requestType === "getAll") {
            // check the sortBy query
            if (!sortBy || !(camelCaseToSnakeCase(sortBy) in this.FieldType)) {
                throw new BadRequestException({
                    message:
                        "The 'sortBy' query must be one fo the table's columns' in camelCase",
                    payload: null,
                    status: 400,
                });
            }

            // check the reverse query
            if (reverse && !["true", "false", true, false].includes(reverse)) {
                throw new BadRequestException({
                    message: "The 'reverse' query must be a boolean type",
                    payload: null,
                    status: 400,
                });
            }

            // check the page query
            if (
                page &&
                (isNaN(page) ||
                    Number(page) < 0 ||
                    parseInt(page, 10) !== parseFloat(page))
            ) {
                throw new BadRequestException({
                    message:
                        "The 'page' query must be a positive integer or a zero",
                    payload: null,
                    status: 400,
                });
            }

            // check the page capacity
            if (
                capacity &&
                (isNaN(capacity) ||
                    Number(capacity) < 1 ||
                    parseInt(capacity, 10) !== parseFloat(capacity))
            ) {
                throw new BadRequestException({
                    message:
                        "The 'capacity' query must be a positive integer larger than zero",
                    payload: null,
                    status: 400,
                });
            }

            // check the ascendants (manyToOne relations)
            if (ascendants) {
                Object.entries(
                    ascendants as { [table: string]: { id: string } }
                ).forEach(([table, { id }]) => {
                    if (!this.ascendants.includes(table)) {
                        throw new BadRequestException({
                            message: `This table has no relation named '${table}'`,
                            payload: null,
                            status: 400,
                        });
                    }
                });
            }

            // transform simple queries
            finalQuery.sortBy = sortBy;
            finalQuery.page = page ? Number(page) : 1;
            finalQuery.capacity = capacity ? Number(capacity) : 5;

            // transform the ids query
            if (ids) {
                finalQuery.ids = typeof ids === "string" ? [ids] : ids;
            } else {
                finalQuery.ids = [];
            }

            // transform the reverse query
            if (reverse) {
                finalQuery.reverse = ["true", "false"].includes(reverse)
                    ? reverse === "true"
                    : reverse;
            } else {
                finalQuery.reverse = false;
            }

            // transform the conditions query
            if (conditions) {
                try {
                    finalQuery.conditions = conditions.map(
                        (condition: string) => JSON.parse(condition)
                    );
                } catch (error) {
                    finalQuery.conditions = [JSON.parse(`${conditions}`)];
                }
            } else {
                finalQuery.conditions = [];
            }
        }

        // transform the descendants query
        if (descendants && typeof descendants === "string") {
            if (descendants === "") finalQuery.descendants = [];
            else if (descendants.indexOf(","))
                finalQuery.descendants = descendants.split(",");
            else finalQuery.descendants = [descendants];
        } else if (descendants && typeof descendants === "object") {
            finalQuery.descendants = descendants.filter(
                (item: string) => !!item
            );
        } else {
            finalQuery.descendants = [];
        }

        // Include status parameter directly in the finalQuery
        if (status) {
            finalQuery.status = status;
        }

        return {
            ...finalQuery,
            ascendants,
        };
    }
}
