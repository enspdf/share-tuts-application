import { createHash } from "crypto";
import { Check } from "typeorm";

export function CheckEnum(tableName: string, fieldName: string, enumValue: any) {
    const hash = createHash("sha1")
        .update(Object.values(enumValue).join(""))
        .digest("hex");

    return Check(
        `cke_${tableName}_${fieldName}_${hash}`.slice(0, 63),
        `${fieldName} in (${Object.values(enumValue).map(t => `'${t}'`)})`
    );
}