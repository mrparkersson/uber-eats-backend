import { EditOrderOutput, EditOrderInput } from './dto/can-edit.dto';
import { GetOrderOutput, GetOrderInput } from './dto/get-order.dto';
import { GetOrdersOutput, GetOrdersInput } from './dto/get-orders.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderOutput, CreateOrderInput } from './dto/create-order.dto';
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { OrderService } from './orders.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customer, createOrderInput);
  }

  @Query(() => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrders(user, getOrderInput);
  }

  @Query(() => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.orderService.getOrder(user, getOrderInput);
  }

  @Mutation(() => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.orderService.editOrder(user, editOrderInput);
  }

  @Mutation(() => Boolean)
  @Role(['Any'])
  potatoReady() {
    pubsub.publish('potatoes', {
      orderSubsciption: 'Your order is ready',
    });
    return true;
  }

  @Subscription(() => String)
  orderSubscription(@AuthUser() user: User) {
    console.log(user);
    return pubsub.asyncIterator('potatoes');
  }
}
