import { Migration } from "@mikro-orm/migrations";

import { base } from "../base";

export class Migration20220102132133 extends Migration {
  public async up(): Promise<void> {
    const knex = this.getKnex();

    const query = knex.schema
      .createTable("User", (table) => {
        base(knex, table);
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.uuid("person").references("id").inTable("Person").notNullable();
      })
      .toQuery();

    this.addSql(query);
  }

  public async down(): Promise<void> {
    const knex = this.getKnex();
    const query = knex.schema.dropTable("User").toQuery();

    this.addSql(query);
  }
}
