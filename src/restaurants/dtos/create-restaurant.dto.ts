import { Restaurant } from './../entities/restaurant.entity';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}
