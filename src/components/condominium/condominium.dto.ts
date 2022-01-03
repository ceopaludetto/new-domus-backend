import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { RemoveMask } from "@/utils/transformers";

@InputType()
export class AddCondominium {
  @IsString()
  @IsNotEmpty()
  @Field()
  public name!: string;

  @RemoveMask()
  @IsString()
  @IsNotEmpty()
  @Field()
  public cnpj!: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true, defaultValue: "#" })
  public character?: string;
}
