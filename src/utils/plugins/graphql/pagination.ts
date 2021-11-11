import type { Type } from "@nestjs/common";
import { Field, ObjectType, Query, QueryOptions } from "@nestjs/graphql";
import type * as Relay from "graphql-relay";

import { PageInfo } from "./dto";

const cache = new Map<string, any>();

function connectionFactory<T>(ref: Type<T>) {
  if (cache.has(ref.name)) return cache.get(ref.name);

  @ObjectType(`${ref.name}Edge`)
  class Edge implements Relay.Edge<T> {
    @Field()
    public cursor!: string;

    @Field(() => ref)
    public node!: T;
  }

  @ObjectType(`${ref.name}Connection`)
  class Connection implements Relay.Connection<T> {
    @Field(() => [Edge])
    public edges!: Edge[];

    @Field(() => PageInfo)
    public pageInfo!: PageInfo;
  }

  cache.set(ref.name, Connection);

  return Connection;
}

export function ConnectionQuery<T>(ref: () => Type<T>, options?: QueryOptions): MethodDecorator {
  return (target, property, descriptor) => {
    const fn = ref();
    const factory = connectionFactory(fn);

    Query(() => factory, options)(target, property, descriptor);
  };
}
