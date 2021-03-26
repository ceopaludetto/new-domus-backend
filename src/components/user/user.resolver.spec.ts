import type { TestingModule } from "@nestjs/testing";

import { User } from "@/models";
import { createTestModule } from "@/utils/test.utils";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

describe("UserResolver", () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let ref!: TestingModule;

  beforeEach(async () => {
    ref = await createTestModule().compile();

    userResolver = ref.get<UserResolver>(UserResolver);
    userService = ref.get<UserService>(UserService);
  });

  it("showUsers", async () => {
    const result = [new User()];
    jest.spyOn(userService, "showAll").mockImplementation(() => Promise.resolve(result));

    expect(await userResolver.showUsers({})).toBe(result);
  });

  it("findUserByID", async () => {
    const result = new User();
    jest.spyOn(userService, "findByID").mockImplementation(() => Promise.resolve(result));

    expect(await userResolver.findUserByID({ id: "" })).toBe(result);
  });

  it("findUserByID", async () => {
    const result = new User();
    jest.spyOn(userService, "findByLogin").mockImplementation(() => Promise.resolve(result));

    expect(await userResolver.findUserByLogin({ login: "" })).toBe(result);
  });

  afterAll(() => ref.close());
});
