import type Knex from "knex";

export function base(knex: Knex, table: Knex.CreateTableBuilder) {
  table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).notNullable().primary();
  table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
  table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
}
