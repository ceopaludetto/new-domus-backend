import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, ValidateNested } from "class-validator";

import { CitySortInput } from "@/components/city/city.dto";
import { State } from "@/models";
import { Sortable } from "@/utils/plugins/sort.plugin.decorator";

@InputType()
export class StateSortInput extends Sortable(State, ["name", "initials"]) {
  @IsOptional()
  @ValidateNested()
  @Field(() => CitySortInput, { nullable: true })
  public cities?: CitySortInput;
}
