import { Resolver, Query, Args } from "@nestjs/graphql";

import { City } from "@/models";
import { FindByID } from "@/utils/common.dto";
import type { Mapped, Sort } from "@/utils/common.dto";
import { MapFields, SortFields, ConnectionArgs, fromArray, ShowAllQuery } from "@/utils/plugins";

import { CitySortInput } from "./city.dto";
import { CityService } from "./city.service";

@Resolver(() => City)
export class CityResolver {
  public constructor(private readonly cityService: CityService) {}

  @ShowAllQuery(() => City)
  public async showCities(
    @Args() args: ConnectionArgs,
    @SortFields(() => CitySortInput) sort?: Sort<City>,
    @MapFields({ paginated: true }) mapped?: Mapped<City>
  ) {
    const { offset, limit } = args.paginationParams();
    const [cities, count] = await this.cityService.showAll({ offset, limit, sort }, mapped);

    return fromArray(cities, args, count, offset);
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
