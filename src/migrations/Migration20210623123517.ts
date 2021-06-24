import { Migration } from '@mikro-orm/migrations';

export class Migration20210623123517 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" text not null, "email" text not null, "password" text not null, "created_at" timestamptz(0) not null, "updated_at" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" text not null, "title" text not null);');
  }

}
