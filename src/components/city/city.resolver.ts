import { Resolver, Query, Args } from "@nestjs/graphql";

import { City } from "@/models";
import { ShowAll, FindByID } from "@/utils/common.dto";
import type { Mapped, Sort } from "@/utils/common.dto";
import { MapFields, SortFields } from "@/utils/plugins";

import { CitySortInput } from "./city.dto";
import { CityService } from "./city.service";

@Resolver(() => City)
export class CityResolver {
  public constructor(private readonly cityService: CityService) {}

  @Query(() => [City])
  public async showCities(
    @Args({ nullable: true }) { take, skip }: ShowAll,
    @SortFields(() => CitySortInput) sort?: Sort<City>,
    @MapFields() mapped?: Mapped<City>
  ) {
    return this.cityService.showAll({ skip, take, sort }, mapped);
  }

  @Query(() => City)
  public async findCityByID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<City>) {
    return this.cityService.findByID(id, mapped);
  }

  @Query(() => [City])
  public async findCitiesByStateID(@Args() { id }: FindByID, @MapFields() mapped?: Mapped<City>) {
    return this.cityService.findByState(id, mapped);
  }
}
