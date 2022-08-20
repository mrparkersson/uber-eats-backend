import {
  SearchRestaurantOutput,
  SearchRestaurantInput,
} from './dtos/search-restaurant.dto';
import { RestaurantOutput, RestaurantInput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { CategoryInput, CategoryOutPut } from './dtos/category.dto';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { Category } from './entities/category.entity';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantOutput,
  EditRestaurantInput,
} from './dtos/edit-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() ownerOfRestaurant: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(
      ownerOfRestaurant,
      editRestaurantInput,
    );
  }

  @Mutation(() => DeleteRestaurantOutput)
  deleteRestaurant(
    @AuthUser() ownerOfRestaurant: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      ownerOfRestaurant,
      deleteRestaurantInput,
    );
  }

  @Query(() => RestaurantsOutput)
  getAllRestaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.getAllRestaurants(restaurantsInput);
  }

  @Query(() => RestaurantOutput)
  getRestaurantById(
    @Args('input') restaurantId: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  @Query(() => SearchRestaurantOutput)
  searchRestaurantByName(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(() => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category);
  }

  @Query(() => AllCategoriesOutput)
  async getAllCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.getAllCategories();
  }

  @Query(() => CategoryOutPut)
  findCategoryBySlug(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutPut> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
