import { Injectable } from "@nestjs/common";
import * as i18next from "i18next";
const Backend =
    require("i18next-fs-backend").default || require("i18next-fs-backend");
import * as i18nextMiddleware from "i18next-http-middleware";
import * as path from "path";

@Injectable()
export class I18nService {
    async setup() {
        await i18next
            .use(Backend)
            .use(i18nextMiddleware.LanguageDetector)
            .init(
                {
                    fallbackLng: "ar",
                    backend: {
                        loadPath: path.resolve(
                            process.cwd(),
                            "src",
                            "i18n",
                            "{{lng}}",
                            "{{ns}}.json"
                        ),
                    },
                    detection: {
                        order: ["header", "querystring", "cookie"],
                        caches: ["cookie"],
                    },
                },
                (err, t) => {
                    if (err) {
                        console.error("Error loading translations:", err);
                    } else {
                        console.log("i18next initialized successfully");
                    }
                }
            );
    }

    translate(key: string): string {
        return i18next.t(key, { lng: i18next.default.language });
    }
}
