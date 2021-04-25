import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {

  @Field(() => Int)
  @PrimaryKey()
  id!: number;
    
  @Field()
  @Property({type: "text", unique: true})
  username!: string;
  
//   @Field()   not exposing
  @Property({type: "text" })
  password!: string;
  
  @Field(() => String)
  @Property({type: Date})
  createdAt: Date = new Date();

  @Field(() => String)  
  @Property({type: "text", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
  
}