/* eslint-disable @typescript-eslint/no-unused-vars */
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

@Injectable()
export class UniquenessPipe implements PipeTransform {
    constructor(
        private readonly fieldName: string,
        private readonly entityClass: EntityClassOrSchema
    ) {}

    async transform(bodyData: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.entityClass) {
            return bodyData;
        }

        return bodyData;
    }
}
