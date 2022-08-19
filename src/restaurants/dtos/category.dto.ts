import {
  PaginationInput,
  PaginationOutput,
} from './../../common/dtos/pagination.dto';
import { Category } from './../entities/category.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field(() => String)
  slug: string;
}

@ObjectType()
export class CategoryOutPut extends PaginationOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;
}
