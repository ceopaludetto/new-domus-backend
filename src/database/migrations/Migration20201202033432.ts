import { Migration } from "@mikro-orm/migrations";

import { BLOCK, CONDOMINIUM } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202033432 extends Migration {
  public async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(BLOCK, (t) => {
          defaults(k, t);
          t.string("name").notNullable();
          t.integer("number").notNullable();
          t.string("condominium").references("id").inTable(CONDOMINIUM).notNullable();
        })
        .toQuery()
    );
  }

  public async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(BLOCK).toQuery());
  }
}
