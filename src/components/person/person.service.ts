import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";

import { Person } from "@/models";
import type { Mapped, ShowAll } from "@/utils/common.dto";

import type { PersonInsertInput } from "./person.dto";

@Injectable()
export class PersonService {
  public constructor(@InjectRepository(Person) private readonly personModel: EntityRepository<Person>) {}

  public async showAll({ offset = 0, limit }: ShowAll, mapped?: Mapped<Person>) {
    return this.personModel.findAndCount(
      {},
      {
        offset,
        limit,
        populate: mapped,
      }
    );
  }

  public async findByID(id: string, mapped?: Mapped<Person>) {
    return this.personModel.findOne({ id }, mapped);
  }

  public async create(data: PersonInsertInput) {
    const person = this.personModel.create(data);

    await this.personModel.persistAndFlush(person);

    return person;
  }
}
