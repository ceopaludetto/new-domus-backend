import { Field, ArgsType, Int } from "@nestjs/graphql";
import * as Relay from "graphql-relay";

type PagingMeta =
  | { pagingType: "forward"; after?: string; first: number }
  | { pagingType: "backward"; before?: string; last: number }
  | { pagingType: "none" };

function checkPagingSanity(args: ConnectionArgs): PagingMeta {
  const { first = 0, last = 0, after, before } = args;

  const isForwardPaging = !!first || !!after;
  const isBackwardPaging = !!last || !!before;

  if (isForwardPaging && isBackwardPaging) {
    throw new Error("Relay pagination cannot be forwards AND backwards!");
  }
  if ((isForwardPaging && before) || (isBackwardPaging && after)) {
    throw new Error("Paging must use either first/after or last/before!");
  }
  if ((isForwardPaging && first < 0) || (isBackwardPaging && last < 0)) {
    throw new Error("Paging limit must be positive!");
  }
  if (last && !before) {
    throw new Error("When paging backwards, a 'before' argument is required!");
  }

  // eslint-disable-next-line no-nested-ternary
  return isForwardPaging
    ? { pagingType: "forward", after, first }
    : isBackwardPaging
    ? { pagingType: "backward", before, last }
    : { pagingType: "none" };
}

const getId = (cursor: Relay.ConnectionCursor) => parseInt(Relay.fromGlobalId(cursor).id, 10);
const nextId = (cursor: Relay.ConnectionCursor) => getId(cursor) + 1;

function getPagingParameters(args: ConnectionArgs) {
  const meta = checkPagingSanity(args);

  switch (meta.pagingType) {
    case "forward": {
      return {
        limit: meta.first,
        offset: meta.after ? nextId(meta.after) : 0,
      };
    }
    case "backward": {
      const { last, before } = meta;
      let limit = last;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let offset = getId(before!) - last;

      if (offset < 0) {
        limit = Math.max(last + offset, 0);
        offset = 0;
      }

      return { offset, limit };
    }
    default:
      return {};
  }
}

@ArgsType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field(() => String, { nullable: true, description: "Paginate before opaque cursor" })
  public before?: Relay.ConnectionCursor;

  @Field(() => String, { nullable: true, description: "Paginate after opaque cursor" })
  public after?: Relay.ConnectionCursor;

  @Field(() => Int, { nullable: true, description: "Paginate first" })
  public first?: number;

  @Field(() => Int, { nullable: true, description: "Paginate last" })
  public last?: number;

  public paginationParams() {
    return getPagingParameters(this);
  }
}

export function fromArray<T>(items: T[], args: ConnectionArgs, count: number, offset?: number) {
  return {
    ...Relay.connectionFromArraySlice(items, args, { arrayLength: count, sliceStart: offset ?? 0 }),
    totalCount: count,
  };
}
