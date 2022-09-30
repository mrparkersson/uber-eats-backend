import { AcceptOrderOutput, AcceptOrderInput } from './dto/accept-order.dto';
import { OrderUpdateInput } from './dto/order-updates.dto';
import {
  NEW_PENDING_ORDER,
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
} from './../common/common.constants';
import { Order } from 'src/orders/entities/order.entity';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../common/common.constants';
import { EditOrderOutput, EditOrderInput } from './dto/can-edit.dto';
import { GetOrderOutput, GetOrderInput } from './dto/get-order.dto';
import { GetOrdersOutput, GetOrdersInput } from './dto/get-orders.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderOutput, CreateOrderInput } from './dto/create-order.dto';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { OrderService } from './orders.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { number } from 'joi';

@Resolver()
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

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

  @Subscription(() => Order, {
    filter: ({ pendingOrders: ownerId }, _, { user }) => {
      return ownerId === user.id;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  @Subscription(() => Order)
  @Role(['Delivery'])
  cookedOrders() {
    return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
  }

  @Subscription(() => Order, {
    filter: (
      { orderUpdates: order }: { orderUpdates: Order },
      { input }: { input: OrderUpdateInput },
      { user }: { user: User },
    ) => {
      if (
        order.driverId !== user.id &&
        order.customerId !== user.id &&
        order.restaurant.ownerId !== user.id
      ) {
        return false;
      }
      return order.id === input.id;
    },
  })
  @Role(['Any'])
  orderUpdates(@Args('input') { id }: OrderUpdateInput) {
    return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
  }

  @Mutation(() => AcceptOrderOutput)
  @Role(['Delivery'])
  acceptOrder(
    @AuthUser() driver: User,
    @Args('input') acceptOrderInput: AcceptOrderInput,
  ): Promise<AcceptOrderOutput> {
    return this.orderService.acceptOrder(driver, acceptOrderInput);
  }
}
