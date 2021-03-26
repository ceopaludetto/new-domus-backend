import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, MaxLength } from "class-validator";

import { RemoveMask } from "@/utils/transforms";
import { IsShortID } from "@/utils/validations";
import * as Messages from "@/utils/validations/messages";

@InputType()
export class AddressInsertInput {
  @Field()
  @IsString({ message: Messages.STRING })
  @MaxLength(8, { message: Messages.MAX_LENGTH })
  @RemoveMask()
  public zip!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  public address!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  public number!: string;

  @Field(() => ID)
  @IsString({ message: Messages.STRING })
  @IsShortID()
  public city!: string;
}
