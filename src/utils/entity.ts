import type { EntityData } from "@mikro-orm/core";
import type { Type } from "@nestjs/common";

export type { EntityData };

export function create<T>(Entity: Type<T>, data: EntityData<T>) {
  const rule = new Entity();

  const keys = Object.keys(data) as (keyof T)[];

  keys.forEach((key) => {
    if (data[key]) {
      rule[key] = data[key] as any;
    }
  });

  return rule;
}
