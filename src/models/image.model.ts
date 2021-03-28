import { Entity, EntityData, ManyToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

import { IMAGE } from "../utils/constants";
import { create } from "../utils/entity";
import { BaseModel } from "./base.model";
import { Block } from "./block.model";

@ObjectType(IMAGE)
@Entity({ tableName: IMAGE })
export class Image extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field()
  @Property()
  public aspectRatio!: number;

  @Field()
  @Property()
  public ext!: string;

  @Field()
  @Property()
  public width!: number;

  @Field()
  @Property()
  public height!: number;

  @Field()
  @Property()
  public size!: number;

  @Field(() => Block, { nullable: true })
  @ManyToOne({ entity: () => Block, inversedBy: (block) => block.images, nullable: true })
  public block!: Block;

  public static create(data: EntityData<Image>) {
    return create(Image, data);
  }
}
