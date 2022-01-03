import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import bcrypt from "bcryptjs";

import { BaseModel } from "./base.model";
import { Person } from "./person.model";

@Entity({ tableName: "User" })
@ObjectType("User")
export class User extends BaseModel {
  @Property({ unique: true })
  @Field()
  public email!: string;

  @Property({ hidden: true })
  public password!: string;

  @OneToOne(() => Person, (person) => person.user, { owner: true, orphanRemoval: true })
  @Field(() => Person)
  public person!: Person;

  public async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
