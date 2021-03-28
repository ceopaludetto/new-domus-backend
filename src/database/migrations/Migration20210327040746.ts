import { Migration } from "@mikro-orm/migrations";

import { BLOCK, IMAGE } from "@/utils/constants";

import { defaults } from "../defaults";

export class Migration20210327040746 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(IMAGE, (t) => {
          defaults(k, t);
          t.string("name").notNullable();
          t.float("aspectRatio", 4, 2).notNullable();
          t.integer("width").notNullable();
          t.integer("height").notNullable();
          t.string("ext").notNullable();
          t.integer("size").notNullable();
          t.string("block").references("id").inTable(BLOCK).nullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(IMAGE).toQuery());
  }
}
