import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { GetPaymentsOutput } from './dtos/get-paymentts.dto';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You are not the right owner',
        };
      }
      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );

      //initializing promotion
      restaurant.isPromoted = true;
      //setting date from when restaurant is created
      const date = new Date();
      //adding 7 days to when restaurant is created
      date.setDate(date.getDate() + 7);
      //setting date to the field of promoted unitl on restaurant entity
      restaurant.promotedUntil = date;
      await this.restaurants.save(restaurant);
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

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({ user: user });
      if (!payments) {
        return {
          ok: false,
          error: 'Payments not found',
        };
      }
      return {
        ok: true,
        payments,
      };
    } catch (error) {
      return {
        ok: false,
        error: error || 'Could not load payments',
      };
    }
  }

  @Cron('45 * * * * *', { name: 'checkpayments' })
  async checkForPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date()),
    });

    restaurants.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      const job = this.schedulerRegistry.getCronJob('checkpayments');
      await this.restaurants.save(restaurant);
      job.stop();
    });
  }
}
