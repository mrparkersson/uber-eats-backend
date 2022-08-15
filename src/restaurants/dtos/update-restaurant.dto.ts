import { CreateRestaurantDto } from './create-restaurant.dto';
import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
class UpdateRestaurantType extends PartialType(CreateRestaurantDto) {}

@ArgsType()
export class UpdateRestaurantDto {
  @Field(() => Number)
  id: number;

  @Field(() => UpdateRestaurantType)
  data: UpdateRestaurantType;
}
