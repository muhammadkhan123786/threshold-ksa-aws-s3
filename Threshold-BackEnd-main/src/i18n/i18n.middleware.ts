import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as i18next from "i18next";
import * as i18nextMiddleware from "i18next-http-middleware";
import { I18nService } from "./i18n.service";

@Injectable()
export class I18nMiddleware implements NestMiddleware {
    constructor(private readonly i18nService: I18nService) {
        this.i18nService.setup();
    }

    use(req: Request, res: Response, next: NextFunction) {
        i18next.default.changeLanguage(req.header("accept-language"));
        i18nextMiddleware.handle(i18next.default)(req, res, next);
    }
}
