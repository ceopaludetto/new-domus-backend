import { Migration } from "@mikro-orm/migrations";

import { base } from "../base";

export class Migration20220102182839 extends Migration {
  public async up(): Promise<void> {
    const knex = this.getKnex();

    const query = knex.schema
      .createTable("Condominium", (table) => {
        base(knex, table);
        table.string("name").notNullable();
        table.string("cnpj", 14).notNullable();
        table.string("character", 1).defaultTo("#").notNullable();
      })
      .toQuery();

    this.addSql(query);
  }

  public async down(): Promise<void> {
    const knex = this.getKnex();
    const query = knex.schema.dropTable("Condominium").toQuery();

    this.addSql(query);
  }
}
