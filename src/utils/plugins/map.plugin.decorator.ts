/* eslint-disable no-undef */
import { Injectable, PipeTransform } from "@nestjs/common";
import { Info } from "@nestjs/graphql";
import type { GraphQLResolveInfo } from "graphql";

import { GraphQLFieldsToRelations } from "./fields.to.relation";

interface MapFieldsOptions {
  paginated?: boolean;
  root?: string[];
}

@Injectable()
class MapFieldsPipe implements PipeTransform {
  public constructor(private readonly options: MapFieldsOptions = {}) {}

  public transform(value: GraphQLResolveInfo) {
    let root = [...(this.options?.root ?? [])];

    if (this.options?.paginated && !this.options?.root) {
      root = ["edges", "node"];
    }

    const last = root.pop();

    const fields = GraphQLFieldsToRelations(value as any, {
      exclude: ["__typename"],
      root: root.join("."),
    });

    if (last) {
      return fields.map((field) => field.replace(new RegExp(`${last}\\.?`), "")).filter(Boolean);
    }

    return fields;
  }
}

export const MapFields = (options?: MapFieldsOptions) => Info(new MapFieldsPipe(options));
