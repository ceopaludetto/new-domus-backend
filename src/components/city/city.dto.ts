import { InputType } from "@nestjs/graphql";

import { City } from "@/models";
import { Sortable } from "@/utils/plugins";

@InputType()
export class CitySortInput extends Sortable(City, ["name"]) {}
