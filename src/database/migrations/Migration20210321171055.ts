import { Migration } from "@mikro-orm/migrations";

import { RULE, CONDOMINIUM } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20210321171055 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(RULE, (t) => {
          defaults(k, t);
          t.text("description").notNullable();
          t.string("condominium").references("id").inTable(CONDOMINIUM).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(RULE).toQuery());
  }
}
