import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity({ abstract: true })
@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  @Field({ nullable: false })
  public id!: string;

  @Property({ onCreate: () => new Date() })
  @Field(() => Date)
  public createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  @Field(() => Date)
  public updatedAt!: Date;
}
