import { Migration } from "@mikro-orm/migrations";

export class Migration20220102183005 extends Migration {
  public async up(): Promise<void> {
    const knex = this.getKnex();

    const query = knex.schema
      .createTable("PersonCondominium", (table) => {
        table.uuid("person").references("id").inTable("Person").notNullable();
        table.uuid("condominium").references("id").inTable("Condominium").notNullable();
      })
      .toQuery();

    this.addSql(query);
  }

  public async down(): Promise<void> {
    const knex = this.getKnex();
    const query = knex.schema.dropTable("PersonCondominium").toQuery();

    this.addSql(query);
  }
}
