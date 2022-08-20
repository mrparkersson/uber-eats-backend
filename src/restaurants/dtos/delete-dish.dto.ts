import { MutationOutput } from './../../common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeleteDishByIdInput {
  @Field(() => Number)
  dishId: number;
}

@ObjectType()
export class DeleteDishByIdOutput extends MutationOutput {}
