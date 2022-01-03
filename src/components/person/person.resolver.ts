import { Resolver } from "@nestjs/graphql";

import { Person } from "@/models";

@Resolver(() => Person)
export class PersonResolver {}
