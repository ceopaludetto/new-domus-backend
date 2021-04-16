import { Migration } from "@mikro-orm/migrations";

import { CONDOMINIUM } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202031837 extends Migration {
  public async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(CONDOMINIUM, (t) => {
          defaults(k, t);
          t.string("companyName").notNullable();
          t.string("cnpj", 14).notNullable();
          t.string("character", 1).defaultTo("#").notNullable();
        })
        .toQuery()
    );
  }

  public async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(CONDOMINIUM).toQuery());
  }
}
