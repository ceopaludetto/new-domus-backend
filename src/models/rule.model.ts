import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { RULE } from "../utils/constants";
import { EntityData, create } from "../utils/entity";
import { BaseModel } from "./base.model";
import { Condominium } from "./condominium.model";

@ObjectType(RULE)
@Entity({ tableName: RULE })
export class Rule extends BaseModel {
  @Field()
  @Property()
  public description!: string;

  @Field(() => Condominium)
  @ManyToOne({
    entity: () => Condominium,
    inversedBy: (condominium) => condominium.rules,
  })
  public condominium!: Condominium;

  public static create(data: EntityData<Rule>) {
    return create(Rule, data);
  }
}
