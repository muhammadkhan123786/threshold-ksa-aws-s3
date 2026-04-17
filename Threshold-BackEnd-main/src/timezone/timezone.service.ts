import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as moment from "moment-timezone";

@Injectable()
export class TimeZoneService {
    constructor(private configService: ConfigService) {}

    initialize() {
        const timeZone = this.configService.get<string>("DEFAULT_TIME_ZONE");
        moment.tz.setDefault(timeZone);
        console.log(`Default time zone set to: ${timeZone}`);
    }
}
