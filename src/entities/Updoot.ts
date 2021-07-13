import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { ObjectType } from "type-graphql";
import { User } from "./User";
import { Post } from "./Post";

// m to n
// many to many
// user <-> posts

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @PrimaryColumn()
  postId: string;

  @ManyToOne(() => Post, (post) => post.updoots)
  post: Post;
}
