import { Entity, Property, ManyToOne, OneToMany, Collection } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { BLOCK } from "../utils/constants";
import { BaseModel } from "./base.model";
import { Condominium } from "./condominium.model";
import { Image } from "./image.model";
import { Local } from "./local.model";

@ObjectType(BLOCK)
@Entity({ tableName: BLOCK })
export class Block extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field()
  @Property()
  public number!: number;

  @Field(() => [Image], { nullable: true })
  @OneToMany({ entity: () => Image, mappedBy: (image) => image.block, nullable: true, orphanRemoval: true })
  public images?: Collection<Image> = new Collection<Image>(this);

  @Field(() => Condominium)
  @ManyToOne({ entity: () => Condominium })
  public condominium!: Condominium;

  @Field(() => [Local], { nullable: true })
  @OneToMany({ entity: () => Local, mappedBy: (local) => local.block })
  public locals: Collection<Local> = new Collection<Local>(this);
}
