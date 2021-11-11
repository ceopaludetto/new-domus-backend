import { ArgsType, Field, Int, ObjectType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import * as Relay from "graphql-relay";

@ObjectType("PageInfo")
export class PageInfo implements Relay.PageInfo {
  @Field()
  public hasNextPage!: boolean;

  @Field()
  public hasPreviousPage!: boolean;

  @Field(() => String, { nullable: true })
  public startCursor!: Relay.ConnectionCursor | null;

  @Field(() => String, { nullable: true })
  public endCursor!: Relay.ConnectionCursor | null;
}

export type ConnectionArgumentsDatabaseParams = { offset: number; limit?: number };

@ArgsType()
export class ConnectionArguments implements Relay.ConnectionArguments {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public after?: Relay.ConnectionCursor;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public before?: Relay.ConnectionCursor;

  @IsInt()
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  public first?: number;

  @IsInt()
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  public last?: number;

  public databaseParams(): ConnectionArgumentsDatabaseParams {
    let offset = 0;

    if (this.after) offset = Relay.cursorToOffset(this.after) + 1;
    if (this.before) offset = Math.max(Relay.cursorToOffset(this.before) - (this?.last ?? 0), 0);

    const limit = this.first ?? this.last;

    return { offset, limit };
  }
}

@ArgsType()
export class FindOne {
  @IsString()
  @IsUUID("4")
  @IsNotEmpty()
  @Field()
  public id!: string;
}
