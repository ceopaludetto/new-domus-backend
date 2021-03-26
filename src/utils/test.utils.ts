import type { ModuleMetadata } from "@nestjs/common";
import { Test } from "@nestjs/testing"; // eslint-disable-line import/no-extraneous-dependencies

import { ApplicationModule } from "../app.module";

export function createTestModule({ imports, ...rest }: ModuleMetadata = {}) {
  return Test.createTestingModule({
    imports: [ApplicationModule, ...(imports ?? [])],
    ...rest,
  });
}
