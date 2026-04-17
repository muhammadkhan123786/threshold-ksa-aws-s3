import { PartialType } from "@nestjs/mapped-types";
import { CreateManagerDTO } from "./manager.dto";

export class UpdateManagerDTO extends PartialType(CreateManagerDTO) {}
