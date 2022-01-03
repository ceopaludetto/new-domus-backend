import { Collection, Entity, ManyToMany, OneToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

import { Condominium } from ".";
import { BaseModel } from "./base.model";
import { User } from "./user.model";

@Entity({ tableName: "Person" })
@ObjectType()
export class Person extends BaseModel {
  @Property()
  @Field()
  public firstName!: string;

  @Property()
  @Field()
  public lastName!: string;

  @Property({ persist: false })
  @Field(() => String)
  public get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Property()
  @Field()
  public cpf!: string;

  @Property()
  @Field()
  public birthDate!: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  public phone?: string;

  @OneToOne(() => User, (user) => user.person)
  @Field(() => User)
  public user!: User;

  @ManyToMany({
    entity: () => Condominium,
    mappedBy: (condominium) => condominium.people,
    pivotTable: "PersonCondominium",
  })
  @Field(() => [Condominium])
  public condominiums: Collection<Condominium> = new Collection<Condominium>(this);
}
