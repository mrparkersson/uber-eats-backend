import { Category } from './../entities/category.entity';
import { MutationOutput } from './../../common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllCategoriesOutput extends MutationOutput {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
