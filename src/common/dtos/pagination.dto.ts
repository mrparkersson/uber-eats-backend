import { MutationOutput } from './output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Number, { defaultValue: 1 })
  page: number;
}

@ObjectType()
export class PaginationOutput extends MutationOutput {
  @Field(() => Number, { nullable: true })
  totalPages?: number;

  @Field(() => Number, { nullable: true })
  totalResultsFound?: number;
}
