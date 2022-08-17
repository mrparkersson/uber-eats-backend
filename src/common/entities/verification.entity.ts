import { v4 as uuidv4 } from 'uuid';
import { User } from './../../users/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './core.entity';
@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(() => String)
  code: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
