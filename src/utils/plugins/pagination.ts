import type { Type } from "@nestjs/common";
import { Field, Int, ObjectType, Query, QueryOptions } from "@nestjs/graphql";
import * as Relay from "graphql-relay";

const cache = new Map<string, any>();

export function Pagination<T>(type: Type<T>) {
  const { name } = type;

  if (cache.has(name)) return cache.get(name);

  @ObjectType(`${name}Edge`, { isAbstract: true })
  class Edge implements Relay.Edge<T> {
    @Field(() => String, { nullable: true })
    public cursor!: Relay.ConnectionCursor;

    @Field(() => type, { nullable: true })
    public node!: T;
  }

  @ObjectType(`${name}PageInfo`, { isAbstract: true })
  class PageInfo implements Relay.PageInfo {
    @Field(() => String, { nullable: true })
    public startCursor!: Relay.ConnectionCursor;

    @Field(() => String, { nullable: true })
    public endCursor!: Relay.ConnectionCursor;

    @Field(() => Boolean)
    public hasPreviousPage!: boolean;

    @Field(() => Boolean)
    public hasNextPage!: boolean;
  }

  @ObjectType(`${name}Connection`, { isAbstract: true })
  class Connection implements Relay.Connection<T> {
    public name = `${name}Connection`;

    @Field(() => [Edge], { nullable: true })
    public edges!: Relay.Edge<T>[];

    @Field(() => PageInfo, { nullable: true })
    public pageInfo!: Relay.PageInfo;

    @Field(() => Int)
    public totalCount!: number;
  }

  cache.set(name, Connection);
  return cache.get(name);
}

export function ShowAllQuery<T>(type: () => Type<T>, options?: QueryOptions) {
  const func = type();

  const connection = Pagination(func);

  return (target: Record<string, any>, property: string | symbol, descriptor: PropertyDescriptor) => {
    Query(() => connection, options)(target, property, descriptor);
  };
}
