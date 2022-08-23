import { EditOrderInput, EditOrderOutput } from './dto/can-edit.dto';
import { GetOrderInput, GetOrderOutput } from './dto/get-order.dto';
import { Dish } from './../restaurants/entities/dish.entity';
import { OrderItem } from './entities/order-item.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { GetOrdersOutput, GetOrdersInput } from './dto/get-orders.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(OrderItem)
    private readonly oderItems: Repository<OrderItem>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          //abort
          return {
            ok: false,
            error: 'Dish not found',
          };
        }
        let dishFinalPrice = dish.price;

        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );

          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice = dishFinalPrice + dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice = dishFinalPrice + dishOption.extra;
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice;
        const orderItem = await this.oderItems.save(
          this.oderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);
      }
      //final stage of creating the Order
      await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: user,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: user,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.restaurants.find({
          where: { owner: user },
          relations: ['orders'],
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }
        return {
          ok: false,
          orders,
        };
      }
      return {
        ok: false,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load orders',
      };
    }
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant'],
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found',
        };
      }

      let allowed = true;
      if (user.role === UserRole.Client && order.customerId !== user.id) {
        allowed = false;
      }
      if (user.role === UserRole.Delivery && order.driverId !== user.id) {
        allowed = false;
      }
      if (
        user.role === UserRole.Owner &&
        order.restaurant.ownerId !== user.id
      ) {
        allowed = false;
      }
      if (!allowed) {
        return {
          ok: false,
          error: 'You are not allowed to view this content',
        };
      }

      return {
        ok: true,
        order,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editOrder(
    user: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId);
      if (!order) {
        return {
          ok: false,
          error: 'Error not found',
        };
      }

      let canEdit = true;
      if (user.role === UserRole.Client) {
        canEdit = false;
      }
      if (user.role === UserRole.Delivery) {
        if (
          status === OrderStatus.PickedUp ||
          status !== OrderStatus.Delivered
        ) {
          canEdit = false;
        }
      }
      if (!canEdit) {
        return {
          ok: false,
          error: 'You can not do that',
        };
      }
      await this.orders.save([{ id: orderId, status }]);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
