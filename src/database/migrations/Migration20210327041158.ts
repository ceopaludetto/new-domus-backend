import { Migration } from "@mikro-orm/migrations";

import { BLOCK } from "@/utils/constants";

export class Migration20210327041158 extends Migration {
  public async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .alterTable(BLOCK, (t) => {
          t.dropColumn("image");
        })
        .toQuery()
    );
  }

  public async down() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .alterTable(BLOCK, (t) => {
          t.string("image").nullable();
        })
        .toQuery()
    );
  }
}
