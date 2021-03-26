import { InputType, Field, ID, Int, PartialType } from "@nestjs/graphql";
import { IsString, IsNumber, IsOptional, IsInt } from "class-validator";
import { GraphQLUpload, FileUpload } from "graphql-upload";

import { IsShortID } from "@/utils/validations";

@InputType()
export class BlockInsertInput {
  @IsString()
  @Field()
  public name!: string;

  @IsInt()
  @IsNumber()
  @Field(() => Int)
  public number!: number;

  @Field(() => GraphQLUpload!, { nullable: true }) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  public image?: Promise<FileUpload>;

  @IsShortID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  public condominium?: string;
}

@InputType()
export class BlockUpdateInput extends PartialType(BlockInsertInput) {}
