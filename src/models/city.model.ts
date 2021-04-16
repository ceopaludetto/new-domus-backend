import { Entity, Property, ManyToOne, OneToMany, Collection } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { CITY } from "../utils/constants";
import { Address } from "./address.model";
import { BaseModel } from "./base.model";
import { State } from "./state.model";

@ObjectType(CITY)
@Entity({ tableName: CITY })
export class City extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field()
  @Property({ unique: true })
  public code!: number;

  @Field(() => State)
  @ManyToOne({ entity: () => State })
  public state!: State;

  @Field(() => [Address])
  @OneToMany({ entity: () => Address, mappedBy: (address) => address.city })
  public addresses: Collection<Address> = new Collection<Address>(this);
}
