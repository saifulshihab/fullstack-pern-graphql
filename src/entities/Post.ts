import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {

  @PrimaryKey()
  id!: number;
 
  @Property({type: Date})
  createdAt: Date = new Date();

  @Property({type: "text", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({type: "text"})
  title!: string;

}