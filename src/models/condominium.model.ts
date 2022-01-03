import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

import { BaseModel } from "./base.model";
import { Person } from "./person.model";

@Entity({ tableName: "Condominium" })
@ObjectType()
export class Condominium extends BaseModel {
  @Property()
  @Field()
  public name!: string;

  @Property({ default: "#" })
  @Field({ defaultValue: "#" })
  public character!: string;

  @Property()
  @Field()
  public cnpj!: string;

  @ManyToMany({ entity: () => Person, inversedBy: (person) => person.condominiums, pivotTable: "PersonCondominium" })
  @Field(() => [Person])
  public people: Collection<Person> = new Collection<Person>(this);
}
