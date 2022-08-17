import { User } from './../entities/user.entity';
import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { MutationOutput } from './../../common/dtos/output.dto';

@ObjectType()
export class EditProfileOutput extends MutationOutput {}

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}
