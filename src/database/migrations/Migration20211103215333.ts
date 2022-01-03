import { Migration } from "@mikro-orm/migrations";

import { base } from "../base";

export class Migration20211103215333 extends Migration {
  public async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    const knex = this.getKnex();

    const query = knex.schema
      .createTable("Person", (table) => {
        base(knex, table);
        table.string("firstName").notNullable();
        table.string("lastName").notNullable();
        table.date("birthDate").notNullable();
        table.string("cpf", 11).notNullable();
        table.string("phone").nullable();
      })
      .toQuery();

    this.addSql(query);
  }

  public async down(): Promise<void> {
    const knex = this.getKnex();
    const query = knex.schema.dropTable("Person").toQuery();

    this.addSql(query);
    this.addSql('DROP EXTENSION IF EXISTS "uuid-ossp";');
  }
}
