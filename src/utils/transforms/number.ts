import { Transform } from "class-transformer";

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function RemoveMask() {
  return Transform(({ value }) => {
    if (isArray(value)) {
      const arr = value.map((item) => {
        const v = typeof item !== "string" ? String(item) : item;

        return v.replace(/[^\d]+/g, "");
      });

      return arr;
    }

    const v = typeof value !== "string" ? String(value) : value;

    return v.replace(/[^\d]+/g, "");
  });
}
