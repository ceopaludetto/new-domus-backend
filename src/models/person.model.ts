import { Entity, Property, Enum, OneToOne, Collection, ManyToMany, ArrayType } from "@mikro-orm/core";
import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";

import { PERSON } from "../utils/constants";
import { Gender } from "../utils/enums";
import { BaseModel } from "./base.model";
import { Condominium } from "./condominium.model";
import { User } from "./user.model";

function generateHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

registerEnumType(Gender, {
  name: "Gender",
});

@ObjectType(PERSON)
@Entity({ tableName: PERSON })
export class Person extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field()
  @Property()
  public lastName!: string;

  @Field()
  @Property({ unique: true })
  public email!: string;

  @Field(() => Gender)
  @Enum(() => Gender)
  public gender!: Gender;

  @Field()
  @Property()
  public cpf!: string;

  @Field()
  @Property()
  public color: string = generateHexColor();

  @Field()
  @Property()
  public birthdate!: Date;

  @Field(() => [String])
  @Property({ type: ArrayType })
  public phones!: string[];

  @Field(() => User)
  @OneToOne({ entity: () => User, mappedBy: (user) => user.person })
  public user!: User;

  @Field(() => [Condominium])
  @ManyToMany({
    entity: () => Condominium,
    mappedBy: (condominium) => condominium.people,
  })
  public condominiums: Collection<Condominium> = new Collection<Condominium>(this);
}
