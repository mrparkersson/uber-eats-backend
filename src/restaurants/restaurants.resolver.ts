import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query(() => [Restaurant])
  async getAll(): Promise<Restaurant[]> {
    return await this.restaurantService.getAll();
  }

  @Mutation(() => Restaurant)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return await this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Mutation(() => Boolean)
  async updateRestaurant(@Args() updateRestaurantDto: UpdateRestaurantDto) {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
