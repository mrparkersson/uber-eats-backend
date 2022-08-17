import { User } from './../entities/user.entity';
import { MutationOutput } from './../../common/dtos/output.dto';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class UserProfileInput {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends MutationOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
