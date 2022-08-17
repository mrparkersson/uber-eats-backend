import { Verification } from './../../common/entities/verification.entity';
import { extend, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from './../../common/dtos/output.dto';
@ObjectType()
export class VerifyEmailOutput extends MutationOutput {}

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) {}
