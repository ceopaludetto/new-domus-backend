import { Migration } from "@mikro-orm/migrations";

import { base } from "../base";

export class Migration20211103215333 extends Migration {
  public async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    const knex = this.getKnex();

    const query = knex.schema
      .createTable("User", (table) => {
        base(knex, table);
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
      })
      .toQuery();

    this.addSql(query);
  }

  public async down(): Promise<void> {
    const knex = this.getKnex();
    const query = knex.schema.dropTable("User").toQuery();

    this.addSql(query);
    this.addSql('DROP EXTENSION IF EXISTS "uuid-ossp";');
  }
}
